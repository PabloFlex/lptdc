import React, {useEffect, useRef, useState,useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList,
  Animated,
  Pressable,
  Linking,
  TouchableOpacity
} from 'react-native';
import TextTicker from 'react-native-text-ticker'
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';;
import ToggleButton from 'react-native-toggle-element';
import axios from 'axios'; 
import normalize from 'react-native-normalize';
import store from 'react-native-simple-store';
import moment from "moment";
import PlayButton from './PlayButton'
import MarqueeText from 'react-native-marquee';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import ProgressBar from "react-native-animated-progress";
import {
  AirplayButton,
} from 'react-airplay';




const {width, height} = Dimensions.get('window');

const MusicPlayer = ({navigation}) => {

  //   custom states
  const [songIndex, setsongIndex] = useState(0);
  const [trackArtist, setTrackArtist] = useState();
  const [titleNow,setTitleNow] = useState(); 
  const [coverAlbum,setCoverAlbum] = useState();
  const [artistNow, setArtistNow] = useState();
  const [startedAt,setStartedAt] = useState();
  const [endAt,setEndAt] = useState();
  const [duration,setDuration]= useState();
  const [timeNow,setTimeNow]= useState()
  const [shouldShow, setShouldShow] = useState(); 
  const [shouldShow3, setShouldShow3] = useState(false);  
  const [currentEvent,setCurrentEvent] = useState('')
  const [currentEventStart,setCurrentEventStart] = useState('')
  const [currentEventEnd,setCurrentEventEnd] = useState('')
  const [lastSongs, setLastSongs] = useState([])
  const [likedSongs,setLikedSongs] = useState([])
  const [lastSongTimeStart,setLastSongTimeStart] = useState()
  const [timeBlock, setTimeBlock] = useState()
  const [timeNowBaretteDeShit, setTimeNowBaretteDeShit] = useState()
  
  // custom referecnces
  const scrollX = useRef(new Animated.Value(0)).current;
  function showButtonInactive(){
     setTimeout(() => {
        setShouldShow(!shouldShow)
     }, 200);
  }

async function CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration, timeNowBaretteDeShit, setTimeNowBaretteDeShit) {
  const greg = await fetch('https://api.radioking.io/widget/radio/radio-jockey/track/current');
  const response = await greg.json();
  const letemp = Date.now() - new Date(response.started_at).getTime()
  const tpnow = moment().unix()
  const tpstart = moment(response.started_at, "YYYY-MM-DD HH:mm Z").unix()


  setTitleNow(response.title)
  setArtistNow(response.artist)
  setCoverAlbum(response.cover)
  setStartedAt(response.started_at)
  setEndAt(response.end_at)
  setDuration(response.duration)
  setTimeNow(tpnow - tpstart)
  if (tpnow - tpstart >= duration) {
    setTimeBlock(false)
  } else {
    setTimeBlock(true)
  }
    setTimeNowBaretteDeShit(letemp / 1000)
    TrackPlayer.updateMetadataForTrack(0, {
      title: response.title,
      artist: response.artist,
      artwork: response.cover,
      duration: duration
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
    },]
  )
}

async function waitAndDo() {
  setTimeout(async function () {
    await CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration, timeNowBaretteDeShit, setTimeNowBaretteDeShit)
    waitAndDo();
  }, 1000);
}
useEffect(() => {
  CallApi(setTitleNow, titleNow, setCoverAlbum, setArtistNow, artistNow, trackArtist, setStartedAt, startedAt, setEndAt, endAt, setDuration, duration, timeNowBaretteDeShit, setTimeNowBaretteDeShit)
  waitAndDo();
}, []);

 
   function CalendarEvent(){
    var axios = require("axios").default;
    var options = {
      method: 'POST',
      url: 'https://api.cronofy.com/oauth/token',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: {
        client_id: 'bCjbPFCdBIeaf5e_EGcymHbHlhHMunaK',
        client_secret: 'BfEBBJ1rR-cKTsa-mFGwNYgDPGyk_hW9B2E4F4bZ4utSptvAN1VzxTEItpEEIVexCelMh7pb1XJRT66FozODqA',
        grant_type: 'refresh_token',
        refresh_token: 'XQWm4Zo6b0ORBdG11Ivr4qlntPBuMlgi'
      }
    };

    axios.request(options).then(function (response) {
     var accesToken = response.data.access_token;
     var dateNow = moment().toISOString(true)
     var dateEnd = moment().add(1, 'days').toISOString(true);
     var axios = require("axios").default;
     var options = {
       method: 'GET',
       url: 'https://api.cronofy.com/v1/events',
       params: {
         from: dateNow,
         to: dateEnd,
         tzid: 'America/Danmarkshavn'
       },
       headers: {
         Authorization: 'Bearer '+accesToken,
         'Content-Type': 'application/x-www-form-urlencoded'
       },
     };
     axios.request(options).then(function (response) {
       const evts = response.data.events
      for(let i in evts){
        const tpstart = moment(evts[i].start, "YYYY-MM-DD HH:mm Z").unix()
        const tpnow = moment().unix()
        const tpend = moment(evts[i].end, "YYYY-MM-DD HH:mm Z").unix()
        if(tpstart < tpnow && tpnow < tpend){
          setCurrentEvent(evts[i].summary)
          setCurrentEventStart(moment(evts[i].start, "YYYY-MM-DD HH:mm Z").format("HH:mm"))
          setCurrentEventEnd(moment(evts[i].end, "YYYY-MM-DD HH:mm Z").format("HH:mm"))
        }
      }
     })
      .catch(function (error) {
        console.log("GET CALENDAR");
        console.log(error);
      });
        })
      .catch(function (error) {
        console.log(error);
      });
      }
      useEffect(() => {
        CalendarEvent()
      }, []);

    function  songEvent(){
    var axios = require("axios").default;
    var options = {
      method: 'GET',
      url: 'https://api.radioking.io/widget/radio/radio-jockey/track/ckoi',
      params: {limit: '10'}
    };
    axios.request(options).then(function (response) {
      setLastSongs(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }
  useEffect(() => {
    songEvent()
      
  }, []);
  
  const rendListSongs = ({ item }) => {
    const time = moment(item.started_at, "YYYY-MM-DD HH:mm Z").format("HH:mm")
    return(
      <View style={{alignItems:'center', marginBottom:normalize(35),width:width}}>
      <Image 
    source={{
      uri:item.cover_url,
    }}   
    style={{  height: normalize(55), width:normalize(55),borderRadius:10,position:'absolute',top:0,left:normalize(60)}}  />
     <View style={{width:normalize(160),top:normalize(12),left:normalize(30)}}>
     <MarqueeText speed={0.1} marqueeOnStart ={true} delay={1000} loop={true} style ={{color:'#F4ECC4',fontFamily:'Futura-Bold',fontSize:12,fontWeight:'700'}}>{item.title}</MarqueeText>
     <MarqueeText speed={0.1} marqueeOnStart ={true} delay={1000} loop={true} style ={{color:'#CDC7A7',fontFamily:'Futura',fontSize:11,fontWeight:'500',marginTop:normalize(5)}}>{item.artist}</MarqueeText>
     <Text style ={{color:'#CDC7A7',fontFamily:'Futura',fontSize:10,fontWeight:'500',left:normalize(170),position:'absolute',marginTop:normalize(5)}}>{time}</Text>
    </View>
 </View>
 )
}

  const letsgo = useCallback(async () => {
    await Linking.openURL('App-Prefs:Bluetooth');
  });
    const logInput = async ()=>{
       const jsonValue = await AsyncStorage.getItem('@songliked');
       const value = JSON.parse(jsonValue);
    
       if (value === null || value === undefined) {
          setLikedSongs(value)
       } else if (value.length > 0) {
          setLikedSongs(value.reverse())
       } else {
          setLikedSongs(value);
       }
     

   if (value[0]?.titleliked === titleNow) {
       setShouldShow3(true)
     } else {
       setShouldShow3(false)
     }
    }
    useEffect(() => {
     logInput()
    }, []);
    const newCache = async () =>{
      let tmp = likedSongs
      if(tmp === null){
        tmp = [
          {
            titleliked: titleNow,
            coverliked: coverAlbum,
            artistliked: artistNow
          }
        ]
      }else{
        tmp.push({
          titleliked: titleNow,
          coverliked: coverAlbum,
          artistliked: artistNow
        })
      }
      const jsonValue = JSON.stringify(tmp)
      await AsyncStorage.setItem('@songliked', jsonValue)
      logInput();
      setShouldShow3(true);
      }

      const deleteCache = async () => {
      
        let tmp = likedSongs
        tmp.shift();
        await AsyncStorage.removeItem('@songliked')
        const jsonValue = JSON.stringify()
        await AsyncStorage.setItem('@songliked', jsonValue)
        setShouldShow3(false);
        
      }
    const renderSong = ({ item }) => {
     return(
          <View style={{alignItems:'center', marginBottom:normalize(20),width:width,backgroundColor:'#3C1128',height:50}}>
          <Image 
        source={{
          uri:item.coverliked,   
        }}   
        style={{  height: normalize(55), width:normalize(55),borderRadius:10,position:'absolute',top:0,left:normalize(60)}}  
      />
         <View style={{width:normalize(160),top:normalize(6),left:normalize(30)}}>
         <MarqueeText speed = {0.1} marqueeOnStart = {true} delay={1000} loop={true} style ={{color:'#F4ECC4',fontFamily:'Futura-Bold',fontSize:12,fontWeight:'700'}}>{item.titleliked}</MarqueeText>
         <MarqueeText speed = {0.1} marqueeOnStart = {true} delay={1000} style ={{color:'#CDC7A7',fontFamily:'Futura',fontSize:11,fontWeight:'500',marginTop:normalize(5)}}>{item.artistliked}</MarqueeText>
         <Pressable onPress={() => {
          navigation.navigate('DetailSongLike', {
            title: item.titleliked,
            artist: item.artistliked,
            coverUrl:item.coverliked
          })
        }}
          >
         <Text style={{color:'#F4ECC4',left:200,position:'absolute',fontFamily:'Futura-Bold',fontSize:18,top:normalize(-25)}}>+</Text>
         </Pressable>
        </View>
     </View>
     )
    }


    //Fonction test CallDelete
    
    //Fonction delete yes 
    const renderHiddenItem = (data, rowMap) => (
      <View style={style.rowBack}>
          <TouchableOpacity
              style={[style.backRightBtn, style.backRightBtnRight]}
              onPress={() => deleteCache() && setShouldShow3(!shouldShow3)}>
              <Text style={{fontFamily:"Futura"}}>Supprimer</Text>
          </TouchableOpacity>
      </View>
       );

       const onRowDidOpen = rowKey => {
        console.log('Overture du menu de suppression');
    };

  return (
    <SafeAreaView style={style.container}>
      {/* Section du player */}
      <View style={style.mainContainer}>
        {/* Image en cover */}  
        <Image 
          source={{
            uri:coverAlbum,   
          }}   
          style={{ height: 298.35, width: normalize(291),borderRadius:10,zIndex:-11010}}  
        />
        {/* Titre & Artiste */}
        <View style={style.playerInfos}> 
        <View style={{width: normalize(140),zIndex:-10,marginLeft:normalize(24)}}>
        <MarqueeText speed = {0.1} marqueeOnStart = {true} delay = {1000} style = {[style.songContent, style.songTitle]} >
            {titleNow}
            </MarqueeText>
          <MarqueeText speed = {0.1} marqueeOnStart = {true} delay ={1000} style = {[style.songContent, style.songArtist]} >
            {artistNow}
          </MarqueeText>
        </View>
        <View style={{backroundColor:'white'}}> 
        <View style ={style.progressBar}>
            <ProgressBar progress={timeNowBaretteDeShit/duration*100} width ={143} height={3} backgroundColor="#FA7C00" trackColor ="#BEB7a0" />
          </View>
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
        {/* Bouton de controle et options */}
        <View style={style.musicControlsContainer}>
          <View style={style.buttonOnComponent}>
             <PlayButton></PlayButton>
          </View>
         
          <View style={style.roundPlayingButton}> 
          </View>
          <View style ={style.buttonAction}>
            {shouldShow3? (        
              <Pressable onPress={() => deleteCache() && setShouldShow3(!shouldShow3) } style={{zIndex:100,}}>
                  <Image style={style.like} source={require("../assets/img/like.png")}></Image>
                  </Pressable>
                ) : (
                <Pressable onPress={() => newCache() } style={{zIndex:100,}}>
                <Image style={style.like} source={require("../assets/img/likeDark.png")}></Image>
                </Pressable>
                )}
         
            <Pressable onPress={()=>navigation.navigate("DetailSong")}>
              <Image style={style.loop} source={require("../assets/img/loop.png")}></Image>
            </Pressable>
         
             <Image style={style.connect} source={require("../assets/img/connect.png")}></Image>
             <AirplayButton
                prioritizesVideoDevices={false}
                tintColor={'#520D2F'}
                activeTintColor={'white'}
                style={{
                  width: 18,
                  height: 18,
                  position:'absolute',
                  alignSelf:'center',
                  alignItems:'center',
                  marginLeft:"83%",
                  zIndex:10000         
                   }}
              />
            
          </View>
        </View>
        <View style={style.precedement}>
          <View style={style.headBottom} >
          {shouldShow? (
          <Text style={style.imageFavoris}>FAVORIS</Text>
            ) : 
            <Text style={style.imagePrecedement}>précedemment</Text>}
            <View style={style.toggleButtonPosition}>
            {shouldShow? (
            <Image source={require("../assets/img/inactivelist.png")}  style={{width:normalize(14), height:normalize(14),zIndex:10,position:'absolute',top:normalize(6.5),left:normalize(6)}} fill={'#FFCA00'}/>
            ) : 
            <Image source={require("../assets/img/inactivelike.png")}  style={{width:normalize(14), height:normalize(14),zIndex:10,position:'absolute',top:normalize(7),left:normalize(30)}} fill={'#FFCA00'}/>
            }
              <ToggleButton
                value={shouldShow}
                onPress = {
                  () => showButtonInactive() && showButtonInactive() && songEvent() && rendListSongs() && logInput()
                }
                thumbActiveComponent={
                  <Image source={require("../assets/img/likeIcon.png")} style={style.overIcon}fill={'#FFCA00'}/>
                }
                thumbInActiveComponent={
                  <Image source={require("../assets/img/precedentIcon.png")} style={style.overIcon2}fill={'#3E64D4'}/>
                }
                trackBar={{
                  activeBackgroundColor: '#3E64D4',
                  inActiveBackgroundColor: '#FFCA00',
                  borderActiveColor: '#3E64D4',
                  borderInActiveColor: '#FFCA00',
                  borderWidth: 0,
                  width: normalize(51),
                  height:normalize(28),
                }}
                thumbButton={{
                  width: normalize(28),
                  height: normalize(28),
                  radius: 30, 
                  activeBackgroundColor: '#FFCA00',
                  inActiveBackgroundColor: '#3E64D4', 
                }} 
                disabledStyle={{ backgroundColor: '#FFCA00' }}
                enableStyle={{backgroundColor:'#3E64D4'}}
                />
            </View>
          </View>
          {shouldShow ? (
            <View style = {{width:width,height:'68%'}}>
              <SwipeListView
              data={likedSongs}
              renderItem={renderSong}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-100}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={500}
              onRowDidOpen={onRowDidOpen}
              />
            </View>
          ):(
           <View style = {{width:width,height:'68%'}}>
              <FlatList 
            data={lastSongs}
            renderItem={rendListSongs}/>
              </View>
          )}
           <View style={style.programBanner}>
            <Pressable onPress={() => navigation.navigate('Calendar')}>
             <Text style={{fontFamily:'BarutaBlack', fontSize:20,marginTop:normalize(20),color:'#3C1128'}}>+  {currentEventStart}h-{currentEventEnd}h - {currentEvent}</Text>
             </Pressable>
           </View>
        </View>
      </View>   
    </SafeAreaView>
  );
}; 

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282D3F',
    marginTop:normalize(-450)
  },
  mainContainer: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position:'relative' , 
    display:'flex',
    marginTop:normalize(150)
    
  },
  bottomSection: {
    borderTopColor: '#282D3F',
    borderWidth: 1,
    width: width,  
    paddingVertical: 15,
    
  },
  mainWrapper: {
    width: width,
    alignItems: 'center',
    
  },
  imageWrapper: {
    width: 300,
    height: 340,
  }, 
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    zIndex:-10,
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
    
    color: '#EEEEEE',
    zIndex:-10,
    
  },
  songTitle: {
    fontSize: 12,
    fontWeight: '700',
    color:'#F4ECC4', 
    marginTop:10,
    fontFamily:'Futura-Bold',
    fontWeight:"700",
    zIndex:-10,
    },

  songArtist: {
    fontSize: 11, 
    fontWeight: '500', 
    color:'#BDB6A0' ,
    zIndex:-10,
    fontFamily:'Futura'
  },
  progressBar: {
    width: normalize(139),
    height: normalize(3),
    marginTop: normalize(10),
    marginLeft:normalize(25), 

    zIndex:0
  },
  progressLevelDuraiton: {
    width: 135, 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#FA7C00',
    fontSize:8,
    fontFamily:'Futura',
    marginLeft:normalize(25),
    marginTop:normalize(4),
    color: '#FA7C00',
    zIndex:-10,
    position:'absolute'
    
  },
  progressLabelText2: {
    marginLeft:normalize(148),
    marginTop:normalize(4),
    color: '#BEB7A0',
    fontSize:8,
    zIndex:0,
    fontFamily:'Futura',
    position:'absolute'
  },
  musicControlsContainer: {
    backgroundColor:'#FA7C00', 
    width:normalize(185),
    height:normalize(75),
    position:'relative',
    marginRight:normalize(190),  
    marginTop:normalize(-75),
    borderBottomLeftRadius:38, 
    borderTopLeftRadius:38,
    zIndex:100
  },
  roundPlayingButton:{
    width:56,
    height:56,
    backgroundColor:'#520D2F',
    borderRadius:100, 
    position:'absolute',
    zIndex:-1, 
    marginLeft:normalize(49),
    marginTop:normalize(10)
  },
  playerInfos:{
    backgroundColor:"#520D2F",
    width:normalize(200),
    height:normalize(75),
    position:'relative',
    marginLeft:normalize(175),
    marginTop:normalize(25),
    borderBottomRightRadius:38, 
    borderTopRightRadius:38,
    zIndex:-10
  },
  playButtonMain:{
    width : normalize(38),
    height: normalize(38),
    marginTop:normalize(17),
    marginLeft:normalize(20),  
    zIndex:1000,
    
  },
  pauseButtonMain:{
    width : normalize(34),
    height: normalize(34),
    marginTop:normalize(19),
    marginLeft:normalize(20.7), 
    zIndex:100
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
    marginLeft:normalize(70),
    width:normalize(29),
    height:normalize(55)
  },
  connect:{
    zIndex:-1,
    marginLeft:normalize(7),
    width:normalize(29),
    height:normalize(55)
  },
  like:{
    zIndex:-1,
    marginLeft:normalize(12),
    width:normalize(29),
    height:normalize(55)
  },
  precedement:{
    width:width,
    height:279,
    backgroundColor:"#3C1128",
    marginTop: 30,

  },
  imagePrecedement:{
    marginTop:normalize(8),
    width:normalize(188),
    height:normalize(32),
    fontFamily:'BarutaBlack',
    fontSize:24,
    marginLeft:normalize(20),
    color:"#3E64D4",
    alignItems:'center',
    
  },
  imageFavoris:{
    marginTop:normalize(8),
    width:normalize(188),
    height:normalize(32),
    fontFamily:'BarutaBlack',
    fontSize:24,
    marginLeft:normalize(110),
    color:"#FDCC00",
    alignItems:'center'
    
  },
  headBottom:{
    width:width,
    height:48,
    backgroundColor:'#520D2F',
    alignItems:'center',
    borderRadius:50,
    borderColor:'#6F193F',
    borderWidth:0.5,
    top:-15,
    zIndex:100,
  },
  overIcon:{
    display:'flex',
    zIndex:10,
    width:normalize(15),
    height:normalize(15),
   
  },
  overIcon2:{
    display:'flex',
    zIndex:10,
    width:normalize(14),
    height:normalize(14)
  },
 
  toggleButtonPosition:{
    display:'flex',
    position:'relative',
    marginLeft:normalize(620),
    marginTop:normalize(-31),
    height:30,
    width:width
  },
  programBanner:{
    width:width,
    backgroundColor:'#FA7C00',
    height:normalize(80),
    marginTop:normalize(235),
    alignItems:'center',
    position:'absolute'
  },
  morebutton:{
    width:26,
    height:26,
    position:'absolute',
    right:-170,
    top:28,
    zIndex:10
    
   },
   morebuttonplus:{
     width:26,
     height:26,
   },
   buttonOnComponent:{
     position:'absolute',
     left:'14%',
     bottom:normalize(81)
   },
   rowFront: {
    alignItems: 'center',
    backgroundColor: '#3C1128',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
},
rowBack: {
    alignItems: 'center',
    backgroundColor: '#3C1128',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    
},
backRightBtn: {
    alignItems: 'center',
    bottom: 10,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
    height:50,
    fontFamily:'Futura'
},
backRightBtnLeft: {
    backgroundColor: '#8388A4',
    right: 75,
    fontFamily:'Futura',
    
},
backRightBtnRight: {
    backgroundColor: '#ED5D68',
    right: 0,
    fontFamily:'Futura',
},
backTextWhite:{
  fontFamily:'Futura',
},
backTextBlack:{
  fontFamily:'Futura',
},

});
