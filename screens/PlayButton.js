import React, {useState,useEffect} from 'react';
import {View ,StyleSheet,Pressable,Image,Dimensions,Vibration} from 'react-native';
import 'react-native-gesture-handler';
import normalize from 'react-native-normalize';
import TrackPlayer, {
  State,
  usePlaybackState,
} from 'react-native-track-player';
import axios from 'axios';
import { trigger } from "react-native-haptic-feedback";
const {width, height} = Dimensions.get('window');
export const SLIDER_WIDTH = Dimensions.get('window').width + 30;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);


//Setting up the player
const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      minBuffer:1,
      waitForBuffer:false
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(songs)
  } catch (error) {
    console.log(error);
  }
};

function PlayButton({props}){
    const [shouldShow, setShouldShow] = useState(false); 
    const playBackState = usePlaybackState();
    const [stating, setStating] = useState(''); 
    const [trackArtist, setTrackArtist] = useState();
    const [titleNow, setTitleNow] = useState();
    const [coverAlbum, setCoverAlbum] = useState();
    const [artistNow, setArtistNow] = useState();
    const [startedAt, setStartedAt] = useState();
    const [endAt, setEndAt] = useState();
    const [duration, setDuration] = useState();
    const baseUrl = 'https://api.radioking.io/widget/radio/radio-jockey/track/current';

    //API call to get the current
    function CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration) {
       axios(
         baseUrl,
       ).then((response) => {
         setTitleNow(response.data.title)
         setArtistNow(response.data.artist)
         setCoverAlbum(response.data.cover)
         setStartedAt(response.data.started_at)
         setEndAt(response.data.end_at)
         setDuration(response.data.duration)

         
         TrackPlayer.updateMetadataForTrack(0, {
          title: response.data.title,
          artist: response.data.artist,
          artwork: response.data.cover,
          duration: response.data.duration
        });
       }) 


       return (
         //Send data to notification center
         songs = [{
           id: 0,
           title: titleNow,
           artist: artistNow,
           start: startedAt,
           end: endAt,
           duration: duration,
           artwork: coverAlbum,
           url: "https://api.radioking.io/radio/285742/listen.m3u",
         }, ]
       )
     }

    //API call for the dom 
    CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration)

    //Display the play or pause button
    function isPlayingActive(){
      if (stating == 'paused'){
        setShouldShow(true)
      }
      else if( stating == 'idle'){
        setShouldShow(true)
      }
      else if( stating == 'playing'){
        setShouldShow(true)
        }
      else{
        setShouldShow(false) 
      }
    }
    
    useEffect(() => {
      //Setting up the player
      setupPlayer();
      //Check the player state 
      togglePlayBack(playBackState)
      //Display the good button
      isPlayingActive()
    }, []);
    //On press on play
    function playfunc(){
      //Set The vibration 
      const options = {
        enableVibrateFallback: true,
      };
      
      trigger("impactLight", options);
      togglePlayBack(playBackState)
     // Vibration.vibrate(100)
    }

    //On press on pause
    function pausefunc(){
      //Set Vibration 
      const options = {
        enableVibrateFallback: true,
      };
      
      trigger("impactLight", options);
      togglePlayBack(playBackState)
     // Vibration.vibrate(100) LIB DE BASE RN 
    }

    //Function get current state of the player
    const togglePlayBack = async playBackState => {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      setStating(playBackState)
      //If currrent track is not null do
      if (currentTrack != null) {
        if (playBackState === State.Paused) { //If player state is to pause the player have to play
          await TrackPlayer.play();
          setShouldShow(false)
          setStating(playBackState)
        } else if (playBackState === State.Playing){   //If player state is play the player have to pause
          await TrackPlayer.pause();
          setShouldShow(true)
        }else if (playBackState === "idle"){ // If the player did not finish to load the player loading
          isPlayingActive()
        }else if (playBackState === "ready"){ //If the player is ready display play button
          await TrackPlayer.play();
          setShouldShow(false)
        }
      }
    };
    return(
      <View>
       <Pressable onPress={() => togglePlayBack(playBackState)}>
        {shouldShow ? (
          <Pressable onPress = {()=> playfunc()} >
            <Image source={require("../assets/img/playing.png")} style={style.playButtonMain} ></Image>  
          </Pressable>
        ) : 
          <Pressable onPress={() => pausefunc()}>
            <View>
              <Image source={require("../assets/img/pausing.png")} style={style.pauseButtonMain}></Image>  
            </View>
          </Pressable>
        }
       </Pressable>
     </View>
    )
  }

  export default PlayButton;

  const style = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundVideo: {
      height: height,
      position: "absolute",
      top: 0,
      left: 0,
      alignItems: "stretch",
      bottom: 0,
      right: 0
      },
      backgroundVideoCarousel:{
        height: 452,
        width:247,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0,
        borderRadius:75
      },
    logo:{
      position:'absolute',
      top:normalize(65),
      right:normalize(220),
      zIndex:5,
      width:normalize(130),
      height:normalize(132)
  
      },
      littlePlayer:{
        width:width,
        height:"15.4%",
        marginTop:normalize(695),
        backgroundColor:'#520D2F',
        borderTopRightRadius:40,
        borderTopLeftRadius:47,
        alignItems:'center',
        zIndex:1,
        position:'absolute',
      },
      openBigPlayer:{
        marginTop:6,
        width:normalize(23),
        height:normalize(3),
        alignItems:'center',
        left:normalize(5),
        top:normalize(3)
      },
      overOpen:{
        width:normalize(200),
        alignItems:'center',
        height:normalize(70),
        marginLeft:7,
        zIndex:20
      },
      menuButton:{
        display:'flex',
        position:'absolute',
        alignItems:'center',
        marginTop:80,
        left:335,
        width:40,
        zIndex:1000,
       
      },
      fadingContainer: {
        padding: 20,
      },
      fadingText: {
        fontSize: 28
      },
      buttonRow: {
        flexBasis: 100,
        justifyContent: "space-evenly",
        marginVertical: 16
      },
      morebutton:{
        width:26,
        height:26,
        position:'absolute',
        right:normalize(20),
        top:normalize(35),
        zIndex:10
       },
       morebuttonplus:{
         width:normalize(26),
         height:normalize(26),
       },
       songContent: {
        marginLeft:9,
        color: '#EEEEEE',
        zIndex:0,
      },
      songTitle: {
        fontSize: 14,
        color:'#F4ECC4', 
        marginTop:10,
        zIndex:0,
        fontFamily:'Futura-Bold',
        fontWeight:"700",
        width:250
        },
      songArtist: {
        fontSize: 14, 
        fontWeight: '500', 
        color:'#BDB6A0',
        zIndex:0,
        fontFamily:'Futura'
      },
      musicControlsContainer: {
        width:normalize(100),
        height:normalize(120),
        right:normalize(70),
        position:'absolute',
        borderBottomLeftRadius:49, 
        borderTopLeftRadius:normalize(147),
        zIndex:0,
      },
      playButtonMain:{
        width : normalize(39),
        height: normalize(39),
        marginTop:normalize(25),
        marginLeft:normalize(32), 
        position:'absolute',
        zIndex:100,
      },
      pauseButtonMain:{
        width : normalize(34),
        height: normalize(34),
        marginTop:normalize(27),
        marginLeft:normalize(33), 
        position:'absolute',
        zIndex:10,
      },
      leboutonplay:{
        zIndex:10,
        marginTop:normalize(-75),
        position:'absolute'
      },
      theboutton:{
        position:'absolute',
        zIndex:10,
        top:normalize(0),
        left:normalize(-5),
      },
      bigbuttonplay:{
        position:'absolute',
        zIndex:10,
        top:normalize(5),
        left:normalize(18),
        width:normalize(20),
        height:normalize(20)
      }
  });