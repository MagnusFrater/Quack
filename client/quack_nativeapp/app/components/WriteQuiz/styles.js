import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../style/styles';

export default StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    paddingTop: 50,
    height: 60,
  },
  background: {
    backgroundColor: colors.qLightGreen
  },
  backgroundContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 50,
  },
  quizBackground: {
      resizeMode: 'contain',
      width: Dimensions.get('window').width - 10,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 20,
      bottom: 0,
      left: 5,
      right: 5,
  },
  foregroundContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 80,
  }, 
  quizText: {
     fontFamily: 'Fira Sans',
     color: 'white',
     fontWeight: 'bold',
     fontSize: 35,
     textAlign: 'left',
     width: 250,
     position: 'absolute',
     top: 40,
     left: 20,

  },
  quizBodyText: {
   // flex: 1,
    fontFamily: 'Fira Sans',
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    width: 350,
    position: 'absolute',
    top: 55,
    bottom: 0,
    left: 15,
 },
 pictureStyle: {
    //resizeMode: 'contain',
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height / 3,
    position: 'absolute',
    top: 20,
    bottom: 0,
    left: 5,
    right: 5,
 },
 quizQuestionText: {
 // position: 'absolute',
  fontFamily: 'Fira Sans',
  color: 'white',
  fontSize: 25,
  textAlign: 'center',
  fontWeight: 'bold'
  //textAlignVertical: 'center',
  //width: Dimensions.get('window').width - 5,
//  paddingTop: 150,
  

},
quizAnswerTextLeft: {
  fontFamily: 'Fira Sans',
  color: 'white',
  fontWeight: 'bold',
  paddingLeft: Dimensions.get('window').width / 4,
},
quizAnswerTextRight: {
  fontFamily: 'Fira Sans',
  color: 'white',
  fontWeight: 'bold',
  paddingLeft: 50,
},
quizQuestionTextWithoutPic: {
  // position: 'absolute',
   fontFamily: 'Fira Sans',
   color: 'white',
   fontSize: 20,
   textAlign: 'center',
   textAlignVertical: 'center',
   width: Dimensions.get('window').width - 5,
 //  paddingTop: 150,
   
 
 },
downIndicator: {
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    paddingRight: 125,
    position: 'absolute',
    top: 40,
    left: 275,

},
nextButton: {
    resizeMode: 'contain',
    position: 'absolute',
    top: Dimensions.get('window').height - 35,
    left: 275, 
},
prevButton: {
  resizeMode: 'contain',
  position: 'absolute',
  top: Dimensions.get('window').height - 36,
  left: 25, 
},
  pictureView: {
      resizeMode: 'contain',
      width: Dimensions.get('window').width - 30,
      height: Dimensions.get('window').height / 3,
      position: 'absolute',
      top: 90,
      bottom: 20,
      left: 15,
      right: 15,
  },
  questionButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 40,
  },
  abQuestionButtons: {
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  textInput: {
     // flex:1,
      width: 100,
      height: 200,
    //  position: 'absolute',
      borderColor: 'white',
      top: 120,
      bottom: 20,
      left: 15,
      right: 15,
  },
  input: {
    height: 100,
    //backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 120,
    borderBottomColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 1.5,
    fontFamily: 'Fira Sans',
    fontWeight: '500',
    fontSize: 18,
    color: 'white',
    paddingLeft: 50,

},  
});