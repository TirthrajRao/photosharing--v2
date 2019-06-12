import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TextInput
  ,Button,FlatList,Image,ScrollView,TouchableOpacity,ActivityIndicator,ToastAndroid,Dimensions} from 'react-native';
  import Config from './config';
  import axios from 'axios';
  import {AsyncStorage} from 'react-native';
  import { Actions } from 'react-native-router-flux';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import MasonryList from "react-native-masonry-list";
  var {width} = Dimensions.get('window');
  import ParsedText from 'react-native-parsed-text';
  import { PermissionsAndroid } from 'react-native';
  import RNFetchBlob from "rn-fetch-blob";
  import _ from 'lodash';
  import differenceBy from 'lodash/differenceBy';





  let config = new Config();
  let sorted_posts;

  export default class Search extends Component{
    constructor(props){
      global.curruntUserData = ""
      super(props)
      this.state= {
        posts:[],
        data: [],
        page: 1,
        loading: true,
        searchedPost:[],
        ButtonStateHolder : false ,
        key:'',
        searchedUser:[],
        friends:[]


      }

    };

    componentDidMount = async ()=>{

      try {
        const curruntUser = await AsyncStorage.getItem('curruntUser');
        if (curruntUser !== null) {
          // return curruntUser;
          // We have data!!
          // console.log("value==============================>",curruntUser);
          data = JSON.parse(curruntUser);
          global.curruntUserData = data
          console.log("value===+++++++++++++++++++++===========================>",global.curruntUserData.data._id);
        }
      } catch (error) {
        // Error retrieving data
      }
      fetch(config.getBaseUrl()+ "user/get-my-friends/"+ global.curruntUserData.data._id).
      then((Response)=>Response.json()).
      then((response)=>{
        // console.log('currunt user Friends following==============================>',response);
        let curruntUserFriends = response;
        this.setState(prevState=>({
          friends:[...prevState.friends,...response]
        }))
      },function(err){
        console.log(err);
      })




    }
    Search = (key)=>{
      console.log('key=============================================>',key);


      if(key == ""){
        // alert("Enter Some UserName")
        ToastAndroid.show('Enter Any name', ToastAndroid.SHORT);
      }else{
        if(key.charAt(0)== '#'){
          var apiBaseUrl = config.getBaseUrl() + "post/search";
          var payload={
            "key":key,
          }
          axios.post(apiBaseUrl,payload)
          .then(response=>{
            console.log('response of serach tag=================>',response.data);
            if(response.data.length > 1){
              for(let i = 0;i<response.data.length;i++){
                console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
                for(let j=0;j<response.data[i].like.length;j++){
                  if(global.curruntUserData.data._id == response.data[i].like[j]){
                    console.log("=================liked=====================")
                    response.data[i].isLiked = true
                  }else{
                    console.log("===================un liked=====================")
                    response.data[i].isLiked = false
                  }
                }
              }
            }
            if(this.state.searchedUser.length != 0){
              this.setState({searchedUser:[]})
            }
            this.setState({searchedPost:response.data})
          },function(err){
            console.log(err);
          })

        }else{
          var apiBaseUrl = config.getBaseUrl() + "user/search";

          var payload={
            "key":key,
          }
          axios.post(apiBaseUrl,payload)
          .then(response=>{
            console.log('serchedUser==============================>',response.data);
            if(response.data.length == 0){
              console.log("=======user not found==============");
              ToastAndroid.show('User Not Found', ToastAndroid.SHORT);
            }else{
              // this.setState({ searchedUser: [...this.state.searchedUser, response] })

              var myFriends = global.curruntUserData.data.friends;
              var searchUserId = response.data[0]._id
              console.log('myFriends===========>',myFriends);
              console.log("searchUserId============>0",searchUserId);
              // console.log("curruntUserFriends================>",this.state.friends);
              var result = this.state.friends.filter(function(o1){
                // if match found return false
                return _.findIndex(response.data, {'id': o1.id}) !== -1 ? false : true;
              });
              console.log('resultttttttttttttttttttttt====================================>',result);
              const searchUsers = differenceBy(response.data, result, '_id');
              console.log('===================myDifferences======================>',searchUsers);
              if(this.state.searchedPost.length != 0){
                this.setState({searchedPost:[]})
              }
              this.setState(prevState=>({
                searchedUser:searchUsers
              }))

              console.log("================resulttttttttttttt=========>",response.data);

            }
          },function(err){
            console.log(err);
          })
        }
      }

    }
    handleClickFollow =(item)=>{
      console.log("data=====================================+++++++++++=====>",item);
      var apiBaseUrl = config.getBaseUrl() + "user/follow";
      var payload={
        "requestedUser":global.curruntUserData.data._id,
        "userTobeFollowed":item._id
      }
      console.log(payload)
      if(payload.requestedUser == payload.userTobeFollowed){
        console.log("user can't follow itself")
        // alert("user can't follow itself")
        ToastAndroid.show("User Can't follow itself", ToastAndroid.SHORT);

      }else{
        axios.post(apiBaseUrl, payload)
        .then(function (response) {
          console.log("response========================>    ",response.data);
          // EventRegister.emit('resp', response.data ) 
          console.log("follow sucessfully................");
          res = item
          Actions.follow();

        },function(err){
          console.log("err",err);

        })
        
      }

    }



    profilePic = (item)=>{
      // console.log("profile pic===========================>",item.userId.profilePhoto);
      if(!item.userId.profilePhoto){
        return(
          <Image resizeMode = 'cover'style={styles.profile}
          source={require('../images/profile.png')}
          />
          )
      }else{
        return(
          <Image  resizeMode = 'cover'style={styles.profile} source={{uri:config.getMediaUrl()+item.userId.profilePhoto}}/>
          )}

      }
      savePostImage = (data) => {
        console.log("=====================",data);

        this.setState(
        {
          visible: true,
          ButtonStateHolder : true  
        },
        () => {
          this.hideToast();
        },
        );


        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            'title': 'Storage',
            'message': 'This app would like to store some files on your phone'
          }
          ).then(() => {
            let dirs = RNFetchBlob.fs.dirs.DownloadDir;
            RNFetchBlob
            .config({
              // response data will be saved to this path if it has access right.
              fileCache : true,
              addAndroidDownloads : {
                title : data,
                path:dirs+'/'+data,
                ext:"jpg",
                useDownloadManager : true,
                description : "fileName",
                notification : true,
              }
            })
            .fetch('GET', config.getMediaUrl()+data, {
            })
            .then((res) => {          
              console.log('The file saved to ', res)
            })
          })

          setTimeout(()=>{
            this.setState({ ButtonStateHolder : false})

          },700)



        }

        hideToast = () => {
          this.setState({
            visible: false,
          });
        };
        commentProfile = (comment)=>{
          if(!comment.userId.profilePhoto){
            return(
              <Image resizeMode = 'cover'style={styles.profile}
              source={require('../images/profile.png')}
              />
              )
          }else{
            return(
              <Image resizeMode = 'cover'style={styles.profile} source={{uri:config.getMediaUrl()+comment.userId.profilePhoto}}/>
              )}

          }
          displayComment = (item)=>{
            if(item.comment.length >3){
              console.log("=======moe than 3 comments===========");
              return(
                item.comment.slice(-3).map((comment) =>{
                  console.log('comment ======================>',comment);
                  var count = Object.keys(comment).length;
                  console.log("=]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]count=============>",count);
                  if(comment && count > 0){
                    console.log("========================in If=======================",count);
                    return(
                      <View>
                      <View  style={{flexDirection:'row'}}>
                      {this.commentProfile(comment)}

                      <View style={{marginTop:5,marginLeft:15}}>
                      <TouchableOpacity
                      onPress = {()=> Actions.userProfile({userId:comment.userId._id})}
                      >
                      <Text style={{fontWeight:'bold',color:'black',marginLeft:10}}>{comment.userId.userName}</Text>
                      </TouchableOpacity>
                      <Text style={styles.text}>{comment.comment}</Text>
                      </View>
                      </View>
                      </View>

                      )
                  }else{
                    console.log("========================in else=======================",count);
                    return(
                      null
                      )
                  }      
                }).reverse()                  
                )

            }else{
              return(
                item.comment.map((comment) =>{
                  console.log('comment ======================>',comment);
                  var count = Object.keys(comment).length;
                  console.log("=]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]count=============>",count);
                  if(comment && count > 0){
                    console.log("========================in If=======================",count);
                    return(
                      <View>
                      <View  style={{flexDirection:'row'}}>
                      {this.commentProfile(comment)}
                      <View style={{marginTop:5,marginLeft:15}}>
                      <TouchableOpacity
                      onPress = {()=> Actions.userProfile({userId:comment.userId._id})}
                      >
                      <Text style={{fontWeight:'bold',color:'black',marginLeft:10}}>{comment.userId.userName}</Text>
                      </TouchableOpacity>
                      <Text style={styles.text}>{comment.comment}</Text>
                      </View>
                      </View>
                      </View>

                      )
                  }else{
                    console.log("========================in else=======================",count);
                    return(
                      null
                      )
                  }      


                }).reverse()
                )
            }
          }

          displayCommentCount = (item) =>{
            console.log("item.comment============>",item.comment[0])
            var count = Object.keys(item.comment[0]).length;
            console.log('count=======in count=============>',count);
            if(count != 0){
              return(
                <TouchableOpacity
                onPress={()=>Actions.post({id:item._id})}>
                <Text style={{marginLeft:10}}>All {item.comment.length} comments</Text> 
                </TouchableOpacity>
                )

            }else{
              return(
                null
                )
            }

          }

          like = async (postId) =>{
            var userId;
            let curruntUser = await AsyncStorage.getItem('curruntUser');
            userId = JSON.parse(curruntUser);
            console.log('userId======================>',userId.data._id);
            console.log('postId============================>',postId);
            var apiBaseUrl = config.getBaseUrl() + "post/like";
            console.log('apiBaseUrl===========>',apiBaseUrl);
            var payload ={
              "postId":postId,
              "userId":userId.data._id
            }
            axios.post(apiBaseUrl, payload)
            .then( function (response) {
              console.log("-------------------------------------------------------------------------------------------");
              console.log("response of  like=================>",response.data);
              // EventRegister.emit('resp', response.data ) 

              console.log("like successfull");
            },function(err){
              console.log(err);

            })
            setTimeout(()=>{
              var apiBaseUrl = config.getBaseUrl() + "post/search";
              var payload={
                "key":this.state.key,
              }
              axios.post(apiBaseUrl,payload)
              .then(response=>{
                console.log('response of serach tag=================>',response.data);
                this.setState({searchedPost:response.data})
              },function(err){
                console.log(err);
              })
            },200)
          }

          comment = async (postId) =>{
            console.log('data=============================>',postId);
            this.setState({
              ButtonStateHolder : true  
            })
            if(this.state.comment == ""){
              // alert("Enter Any Comment");
              ToastAndroid.show('Enter any comment', ToastAndroid.SHORT);

              this.setState({
                ButtonStateHolder : false  
              })

            }else{

              var userId;
              let curruntUser = await AsyncStorage.getItem('curruntUser');
              userId = JSON.parse(curruntUser);
              console.log('userId======================>',userId.data._id);
              console.log('postId============================>',postId);
              var apiBaseUrl = config.getBaseUrl() + "comment/addcomment";
              console.log('apiBaseUrl===========>',apiBaseUrl);
              var payload ={
                "postId":postId,
                "userId":userId.data._id,
                "comment":this.state.comment
              }
              axios.post(apiBaseUrl, payload)
              .then( function (response) {
                console.log("-------------------------------------------------------------------------------------------");
                // console.log("response=================>",response.data);
                // EventRegister.emit('resp', response.data ) 

                console.log("comment successfull");
              },function(err){
                console.log(err);

              })

              this.setState(prevState => ({
                comment: '',
                ButtonStateHolder : false  
              }))
              setTimeout(()=>{
                var apiBaseUrl = config.getBaseUrl() + "post/search";
                var payload={
                  "key":this.state.key,
                }
                axios.post(apiBaseUrl,payload)
                .then(response=>{
                  console.log('response of serach tag=================>',response.data);
                  this.setState({searchedPost:response.data})
                },function(err){
                  console.log(err);
                })
              },200)

            }
          }





          render() {
            const Toast = (props) => {
              if (props.visible) {
                ToastAndroid.showWithGravityAndOffset(
                  props.message,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  140,
                  );
                return null;
              }
              return null;
            };
            console.log("Searched Post====================>",this.state.searchedPost);
            return(
              <>
              <View style={{flexDirection: 'row',marginTop:10}}>
              <TextInput
              value={this.state.key}
              onChangeText={(key) => this.setState({key: key })}
              placeholder={'Search'}        
              style={styles.input}
              autoFocus={true}
              />
              <TouchableOpacity

              onPress={()=>this.Search(this.state.key)}>

              <Icon name='search' color='black' size={25} style={{marginTop:9,opacity:0.5,marginLeft:5}}/>
              </TouchableOpacity>
              </View>
              <View style={{elevation:3,backgroundColor:'white'}}>
              <FlatList
              data={this.state.searchedUser}
              style={{elevation:5}}
              renderItem={({item}) => 
              <View style={{flexDirection: 'row',marginBottom:10}}>
              <Text style={styles.name_text}>{item.userName}</Text>



              <TouchableOpacity 
              style={styles.button2}
              onPress={ ()=>this.handleClickFollow(item)}>
              <Text style={{textAlign:'center',marginTop:5,color:'white'}}>Follow</Text>
              </TouchableOpacity>




              </View>

            }
            />
            </View>
            <View style={{marginBottom:55}}>
            <ScrollView>
            {this.state.searchedPost.map((item)=>
              <View style={styles.card}>
              <View>
              <View style={{flexDirection: 'column'}}>
              <View style={{flexDirection: 'row'}}>
              <View style={{flex:10}}>
              <View style={{flexDirection:'row'}}>
              <View>
              {this.profilePic(item)}
              </View>
              <View>
              <TouchableOpacity
              onPress = {()=> Actions.userProfile({userId:item.userId._id})}
              >
              <Text style={styles.userName}>{item.userId.userName}</Text>
              </TouchableOpacity>
              </View>
              </View>
              </View>
              <View style={{flex:1}}>
              <Icon onPress={()=>{this.savePostImage(item.images)}}
              name= "save"
              size = {30}
              color={this.state.ButtonStateHolder ? '#C0C0C0' :'#696969'}
              disabled={this.state.ButtonStateHolder}
              style={{marginTop:10,marginRight:5}}
              />
              <Toast visible={this.state.visible} message="Downloading..." />

              </View>

              </View>

              <Image  resizeMode = 'cover'style={styles.post_img} source={{uri:config.getMediaUrl()+item.images}}/>


              </View>
              </View>
              <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row',marginTop:10}}>
              <View>

              {item.isLiked?( <Icon name= "favorite"
                size = {25}
                onPress={()=>this.like(item._id)}
                style={{ marginLeft:10,color:'#cd1d1f'}}
                />):( <Icon name= "favorite-border"
                size = {25}
                onPress={()=>this.like(item._id)}
                style={styles.like}
                />)}
                </View>
                <View>
                </View>
                {item.like.length >0 ?(<Text style={styles.likeText}>{item.like.length} Likes</Text>):(null)}

                </View>



                </View>


                <View style={{marginBottom:10}}>
                <View style={{flexDirection:'row',marginBottom:10}}>
                <TouchableOpacity
                onPress = {()=> Actions.userProfile({userId:item.userId._id})}
                >
                <Text style={{fontWeight:'bold',color:'black',marginLeft:10,textTransform:'capitalize'}}>{item.userId.userName}</Text>
                </TouchableOpacity>
                <ParsedText
                style={styles.text}
                parse={
                  [
                  {pattern: /#(\w+)/,style: styles.hashTag},

                  ]
                }
                childrenProps={{allowFontScaling: false}}
                >
                {item.content}
                </ParsedText>

                </View>

                <View style={{marginBottom:10}}>

                <TextInput
                value={this.state.comment}
                onChangeText={(comment) => this.setState({comment: comment })}
                placeholder={'Comment here....'}       
                style={styles.input}
                />
                <TouchableOpacity  style={styles.button}
                onPress={()=>this.comment(item._id)}
                disabled={this.state.ButtonStateHolder}>

                <Icon 
                name= "send"
                size = {25}
                color={this.state.ButtonStateHolder ? '#C0C0C0' :'#696969'}

                />

                </TouchableOpacity>
                </View>
                <TouchableOpacity
                onPress ={()=>Actions.post({id: item._id})}
                >
                </TouchableOpacity>
                {this.displayCommentCount(item)}
                {this.displayComment(item)}




                </View>


                </View>

                )}

            </ScrollView>

            </View>

            </>
            )
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
  button: {       
    marginTop: 5,
    position:'absolute',
    right:10
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
    card:{

      elevation:5,
      color:'white',
      // marginLeft:5,
      // marginRight:5, 
      backgroundColor:'white',
      borderBottomColor:'#ddd',
      borderBottomWidth: 2,
      // marginBottom:10
    },
    post_img: {
      height: 325,
      // width: 325,
      // margin:10,
      width: width * 1,
      marginTop:10
    },
    userName:{
      color:'black',
      fontSize:18,
      marginLeft:20,
      marginTop:13,
      fontWeight:'bold',
      textTransform:'capitalize'
    },
    text:{
      color:'gray',
      fontSize:15,
      marginLeft:10,
      flex: 1,
      flexWrap: 'wrap'
    },
    like:{
      color:'#696969',
      marginLeft:10,

    },
    likeText:{
      color:'black',
      marginLeft:10,
      marginTop:5
    },
    profile:{
      borderRadius:50,
      height:40,
      width:40,
      marginTop:5,
      left:10,
      borderColor:'#ad177d',
      borderWidth:3,
    },
    hashTag:{
      color:'#3F729B'
    },
    button2:{
      marginTop: 15,
      height: 33,
      padding: 0,
      width: 70,
      backgroundColor: '#0099e7',
      borderRadius: 3,
      marginRight:22,

    },
    name_text: {
      fontSize: 18,
      flexDirection:'column',
      flex:8,
      marginLeft:10,
      marginTop:14,
      color:'black'
    },
  });

