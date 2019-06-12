/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View,TextInput
   ,Button,FlatList,Image,ScrollView,TouchableOpacity,ActivityIndicator,ToastAndroid} from 'react-native';
   import Config from './config';
   import axios from 'axios';
   import {AsyncStorage} from 'react-native';
   import { Actions } from 'react-native-router-flux';
   import Icon from 'react-native-vector-icons/MaterialIcons';
  
  





   let config = new Config();
   let sorted_posts;

   export default class Explore extends Component{
     constructor(props){
       super(props)
       this.state= {
         posts:[],
         data: [],
         page: 1,
         loading: true,
         ButtonStateHolder : false ,
         

       }
       
     };

     

     componentDidMount = async ()=>{
       fetch(config.getBaseUrl() + "post/get-all-post").
       then((Response)=>Response.json()).
       then((response)=>{
         console.log('all post postss===================>',response);
         // console.log('all post postss===================>',response.length);
         sorted_posts = response.sort((a,b) => {
           return new Date(a.created_date).getTime() - 
           new Date(b.created_date).getTime()
         }).reverse();
         console.log('sorted post==================================>',sorted_posts);
         this.setState(prevState=>({
           posts:[...prevState.posts,...response]
         }))
         // this.setState({
           //   userPost:response
           // })
         },function(err){
           console.log(err);
         })

     }


     render() {

       console.log("posttttttttt=============>",this.state.posts);
       console.log("searched post=====================>",this.state.searchedPost);
       if(this.state.posts.length == 0){
         return(
           <>
           <View style={{flexDirection: 'row',marginTop:10}}>
           <TextInput
           value={this.state.key}
           onChangeText={(key) => this.setState({key: key })}
           placeholder={'Search'}        
           style={styles.input}
           />



           <Icon name='search' color='black' size={25} style={{marginTop:10,opacity:0.5}}/>
           

           </View>

           <View style={[styles.horizontal,{justifyContent: 'center',alignItems:'center',flex: 1}]}>

           <ActivityIndicator size="large" color="#ef6858" />
           </View>

           <View style={ styles.bottomView} >         
           <View style={{flexDirection:'row'}}>
           <View style={styles.footer}>
           <Icon name= "home"
           size = {35}
           onPress={()=>Actions.posts()}
           />
           </View>
           <View style={styles.footer}>
           <Icon name= "search"
           size = {35}
           onPress={()=>Actions.explore()}

           />
           </View>

           <View style={styles.footer}>
           <Icon name= "add-box"
           size = {35}
           color={'#0099e7'}
           onPress={()=>Actions.addPost()}
           />
           </View>

           <View style={styles.footer}>
           <Icon name= "favorite-border"
           size = {35}
           onPress={()=>Actions.follow()}
           />
           </View>

           <View style={styles.footer}>
           <Icon name= "perm-identity"
           size = {35}
           onPress={()=>Actions.profile()}

           />
           </View>

           </View>
           </View>
           </>



           )
       }else{


         return(
           <>
           <View style={{flexDirection: 'row',marginTop:10}}>
           <TouchableOpacity
           style={styles.input}

           onPress={()=> Actions.Search()}>
           <Text style={{color:'gray'}}>Search</Text>

           </TouchableOpacity>
           <Icon name='search' color='black' size={25} style={{marginTop:9,opacity:0.5,marginLeft:5}}/>
           </View>

           <View style={{marginBottom:100,marginLeft:19}}>
           <ScrollView> 

           <FlatList
           data={sorted_posts}
           renderItem={({item}) => 
           <Image style={styles.img} source={{uri:config.getMediaUrl()+item.images}}/>
           // <MasonryList sorted  images={{uri:config.getMediaUrl()+item.images}} />
         }
         numColumns={2}
         />

         </ScrollView>
         </View>



         <View style={ styles.bottomView} >         
         <View style={{flexDirection:'row'}}>
         <View style={styles.footer}>
         <Icon name= "home"
         size = {35}
         onPress={()=>Actions.posts()}
         />
         </View>
         <View style={styles.footer}>
         <Icon name= "search"
         size = {35}
         onPress={()=>Actions.explore()}

         />
         </View>

         <View style={styles.footer}>
         <Icon name= "add-box"
         size = {35}
         color={'#0099e7'}
         onPress={()=>Actions.addPost()}
         />
         </View>

         <View style={styles.footer}>
         <Icon name= "favorite-border"
         size = {35}
         onPress={()=>Actions.follow()}
         />
         </View>

         <View style={styles.footer}>
         <Icon name= "perm-identity"
         size = {35}
         onPress={()=>Actions.profile()}

         />
         </View>

         </View>
         </View>




         </>
         );
       }
     }

   }


   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#F5FCFF',
     },
     footer: {
       flexDirection:'column',flex:6,
       justifyContent: 'center', 
       alignItems: 'center',
     },
     img: {
       height: 140,
       width: 140,
       margin:10,
       borderRadius:3
     },
     // GridViewContainer: {
       //   flex:1,
       //   height: 150,
       //   margin: 5,

       // },
       MainContainer:
       {
         flex: 1,
         alignItems: 'center',
         justifyContent: 'center',
         paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
       },
       bottomView:{
         width: '100%', 
         height: 50, 
         backgroundColor: 'white', 
         justifyContent: 'center', 
         alignItems: 'center',
         position: 'absolute',
         bottom: 0
       },
       horizontal: {
         flexDirection: 'row',
         justifyContent: 'space-around',
         padding: 10
       },
       input: {
         width: 310,
         height: 35,
         padding: 10,
         borderColor: '#C0C0C0',
         borderWidth: 1,
         marginBottom: 10,
         marginLeft:10,
         borderRadius:5
       },
      
     });
