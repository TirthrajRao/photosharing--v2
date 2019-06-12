import React from 'react'
import Login from './login';
import SignUp from './signUp';
import Follow from './follow';
import Post from './posts';
import Profile from './profile';
import Addpost from './addPost';
import Explore from './explore';
import SinglePost from './singlePost';
import UserProfile from './visitProfile';
import TabViewExample from './tab';
import Search from './Search';

import { Router, Scene } from 'react-native-router-flux';
import {Platform, StyleSheet} from 'react-native';


// import {createStackNavigator, createAppContainer} from 'react-navigation';

// const MainNavigator = createStackNavigator({

// 	SinglePost: {
// 		screen: Login,
// 		navigationOptions:  {
// 			title: 'Login',

// 		}
// 	},
// 	SignUp:{
// 		screen: SignUp,
// 		navigationOptions:  {
// 			title: 'SignUp',

// 		}

// 	}



// });

// const Routes = createAppContainer(MainNavigator);

const Routes1 = () => (

   <Router>
   <Scene key = "root">
   
 
   <Scene key = "posts"  component = {Post} title = "Posts" titleStyle={styles.navTitle}  />
   <Scene key = "follow" component = {Follow}   title="Follow" titleStyle={styles.navTitle} />
   <Scene key = "profile" component = {Profile} title = "Profile" hideNavBar={true} titleStyle={styles.navTitle} />
   <Scene key = "addPost" component = {Addpost} title = "Add post" titleStyle={styles.navTitle} />
   <Scene key = "explore"   component = {Explore} title = "Explore" titleStyle={styles.navTitle} />
   <Scene key = "post"   component = {SinglePost} title = "Singlepost" titleStyle={styles.navTitle} />
   <Scene key = "login" component = {Login} title = "login" titleStyle={styles.navTitle} />
   <Scene key = "signup" component = {SignUp} title = "signup" titleStyle={styles.navTitle} />
   <Scene key = "userProfile"   component = {UserProfile} title = "Profile" titleStyle={styles.navTitle}/>
   <Scene key = "Search"   component = {Search} title = "Search" titleStyle={styles.navTitle}/>

   </Scene>
   </Router>
   )
export default Routes1

const styles = StyleSheet.create({
   navTitle: {
    color: '#696969', // changing navbar title color
    fontWeight:'normal'
 },
})

// export default Routes;