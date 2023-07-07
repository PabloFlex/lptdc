import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import TrackPlayer, {
  Event,
  Capability,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
const {width, height} = Dimensions.get('window');
import normalize from 'react-native-normalize';
import moment from 'moment';
import MarqueeText from 'react-native-marquee';
import ProgressBar from "react-native-animated-progress";
import { trigger } from "react-native-haptic-feedback";

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      waitForBuffer:false,
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,

        Capability.SeekTo
      ],
    });
    await TrackPlayer.add(songs)
    await TrackPlayer.seekTo(10);
    
  } catch (error) {
    console.log(error);
  } 
};

//Function for little player
const MusicPlayer = () => {
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork,setTrackArtwork]= useState()
  const [titleNow,setTitleNow] = useState(); 
  const [coverAlbum,setCoverAlbum] = useState();
  const [artistNow, setArtistNow] = useState();
  const [startedAt,setStartedAt] = useState('');
  const [endAt,setEndAt] = useState();
  const [duration,setDuration]= useState();
  const [timeNow,setTimeNow]= useState()
  const [timeBlock,setTimeBlock] = useState()
  const [timeNowBaretteDeShit, setTimeNowBaretteDeShit] = useState()
  
  useEffect(() => {
      setupPlayer()
    }, []);

  async function CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration) {
    const greg = await fetch('https://api.radioking.io/widget/radio/radio-jockey/track/current');
      const response = await greg.json();
      const tpnow = moment().unix()
      const tpstart = moment(response.started_at, "YYYY-MM-DD HH:mm Z").unix()
      const letemp = Date.now() - new Date(response.started_at).getTime()

      setTitleNow(response.title)
      setArtistNow(response.artist)
      setCoverAlbum(response.cover)
      setStartedAt(response.started_at)
      setEndAt(response.end_at)
      setDuration(response.duration)
      setTimeNow(tpnow - tpstart)
      
      console.log(letemp)
      if(tpnow - tpstart >= duration) {
        setTimeBlock(false) 
      }else{
        setTimeBlock(true)
      }

      setTimeNowBaretteDeShit(letemp/1000)
      TrackPlayer.updateMetadataForTrack(0, {
        title: response.title,
        artist: response.artist,
        artwork: response.cover,
        duration: response.duration
      });
  
      return (
        songs = [{
            id: 0,
            title: titleNow,
            artist: artistNow,
            start: startedAt,
            end: endAt,
            duration: duration,
            cover: '../assets/img/img1.jpg',
            url: "https://api.radioking.io/radio/285742/listen.m3u",
          }, ]
        )
    }

  async function waitAndDo() {
    setTimeout( async function () {
      await CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration, timeNowBaretteDeShit, setTimeNowBaretteDeShit)
      waitAndDo();
    }, 1000);
  }

  useEffect(() => {
    CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration ,timeNowBaretteDeShit, setTimeNowBaretteDeShit)
    waitAndDo();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {
        title,
        artwork,
        artist
      } = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  return (
    <SafeAreaView style={style.container}>
      {/* Little music player section */}
      <View style={style.mainContainer}>
        {/* Image cover album */}  
        <Image source={{uri:coverAlbum}} style={{ height: normalize(55), width: normalize(55),borderRadius:10,left:normalize(95),top:-32,position:'absolute',display:'flex',zIndex:10}}/>
        {/* Title & Artist Name */}
        <View style={style.playerInfos}> 
        <View style={{width: normalize(140),marginTop:normalize(10),marginLeft:normalize(9)}}>
          <MarqueeText speed = {0.1} marqueeOnStart = {true} delay={1000} loop={true} style = {[style.songContent, style.songTitle]} >
              {titleNow}
          </MarqueeText>
          <MarqueeText speed = {0.1} marqueeOnStart = {true} delay = {1000} loop={true} style = {[style.songContent, style.songArtist]} >
              {artistNow}
          </MarqueeText>
        </View>
        {/* Progress bar */}
        <View style={style.blockInfo}>
          <View style ={style.progressBar}>
            <ProgressBar animated ={false} progress={Math.round(timeNowBaretteDeShit/duration*100)} width ={143} height={3} backgroundColor="#FA7C00" trackColor ="#BEB7a0" />
          </View>
         
        {/* Timer */}
        <View style={style.progressLevelDuraiton}>
           {timeBlock ? (
            <Text style={style.progressLabelText}>
              {~~((timeNowBaretteDeShit % 3600)/60)}:{new Date(timeNowBaretteDeShit*1000).toLocaleTimeString().substring(6)}
            </Text>
           ): 
            <Text style={style.progressLabelText}>
              {~~((duration % 3600)/60)}:{new Date(duration * 1000).toLocaleTimeString().substring(6)}
            </Text>
          }
            <Text style={style.progressLabelText2}>
             {~~((duration % 3600)/60)}:{new Date(duration * 1000).toLocaleTimeString().substring(6)}
            </Text>
          </View>
        </View>  
        </View>
        {/* Round Background of player button */}
        <View style={style.musicControlsContainer}>       
          <View style={style.roundPlayingButton}/> 
        </View>
      </View>   
    </SafeAreaView>
  );
}; 

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:normalize(-17)
  },
  mainContainer: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position:'relative' , 
    display:'flex',
  },
  bottomSection: {
    borderWidth: 1,
    width: width,  
    paddingVertical: 15,
  },
  mainWrapper: {
    width: width,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 56,
    height: 57,
  }, 
  musicImage: {
    width: 56,
    height: 57,
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    marginLeft:0,
    color: '#EEEEEE',
    zIndex:0
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '700',
    color:'#F4ECC4', 
    marginTop:normalize(18),
    zIndex:0,
    fontFamily:'Futura-Bold'
  },
  songArtist: {
    fontSize: 12, 
    fontWeight: '300', 
    color:'#BDB6A0',
    zIndex:0,
    fontFamily:'Futura'
  },
  progressBar: {
    width: normalize(139),
    height: normalize(3),
    marginTop: normalize(15),
    marginLeft:normalize(9.5), 

    zIndex:0
  },
  progressLevelDuraiton: {
    width: normalize(145), 
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex:0
  },
   progressLabelText: {
    color: '#FA7C00',
    fontSize:8,
    fontFamily:'Futura',
    marginLeft:normalize(10),
    marginTop:normalize(4),
    color: '#FA7C00',
    zIndex:-10,
    position:'absolute'
  },
  progressLabelText2: {
    marginLeft:normalize(132),
    marginTop:normalize(4),
    color: '#BEB7A0',
    fontSize:8,
    zIndex:0,
    fontFamily:'Futura',
    position:'absolute'
  },
  musicControlsContainer: {
    backgroundColor:'#FA7C00', 
    width:normalize(100),
    height:normalize(120),
    marginLeft:normalize(-285.5),
    marginTop:normalize(-75.5),
    position:'relative',
    borderBottomLeftRadius:49, 
    borderTopLeftRadius:normalize(147),
    zIndex:0,
  },
  roundPlayingButton:{
    width:normalize(66),
    height:normalize(66),
    backgroundColor:'#520D2F',
    borderRadius:100, 
    position:'absolute',
    zIndex:10, 
    marginLeft:normalize(20),
    marginTop:normalize(20)
  },
  playerInfos:{
    width:normalize(182),
    height:normalize(80),
    marginLeft:normalize(160),
    marginTop:normalize(-30),
    borderBottomRightRadius:38, 
    borderTopRightRadius:38,
    zIndex:0
  },
  playButtonMain:{
    width : normalize(46),
    height: normalize(46),
    marginTop:normalize(24),
    marginLeft:normalize(32), 
  },
  pauseButtonMain:{
    width : normalize(40),
    height: normalize(40),
    marginTop:normalize(27),
    marginLeft:normalize(33), 
  },
  likeBackGround:{
    backgroundColor:"#FDCC00",
    width:29, 
    height:55,
  },
  loopBackground:{
    width:29,
    height:55,
    display:'flex',
    position:'relative',
    marginBottom:100 ,
  },
  bluetoothBackGround:{
    backgroundColor:"#FDCC00",
    width:29,
    height:55
  },
  buttonAction:{
    zIndex:-1,
    display:'flex',
    flexDirection:'row',
    position:'absolute',
    marginTop:10,
  },
  loop:{
    zIndex:-1,
    marginLeft:65
  },
  connect:{
    zIndex:-1,
    marginLeft:5
  },
  like:{
    zIndex:-1,
    marginLeft:10
  },
  precedement:{
    width:width,
    height:279,
    backgroundColor:"#3C1128",
    marginTop: 25,
  },
  imagePrecedement:{
   marginTop:15,
  },
  headBottom:{
    width:width,
    height:48,
    backgroundColor:'#520D2F',
    alignItems:'center',
    borderRadius:50,
    borderColor:'#6F193F',
    borderWidth:0.5
  },
  overIcon:{
    display:'flex',
    zIndex:1,
    marginTop:7, 
    marginLeft:7
  },
  toggleButtonPosition:{
    display:'flex',
    position:'relative',
    marginLeft:650,
    marginTop:-22,
    height:30,
    width:width
  },
  programBanner:{
    width:width,
    backgroundColor:'#FA7C00',
    height:70,
    marginTop:232
  },
  morebutton:{
   width:26,
   height:26,
   position:'absolute',
   right:-280,
   top:35,
   zIndex:10
   
  },
  morebuttonplus:{
    width:normalize(26),
    height:normalize(26),
  }
});