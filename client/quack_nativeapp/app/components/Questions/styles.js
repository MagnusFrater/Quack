import { StyleSheet } from 'react-native';
import { colors } from '../../style/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.qLightGreen,
  },
  backButton: {
    color: 'white',
    height: 30,
    width: 30,
  },
  header: {
    backgroundColor: colors.qLightGreen,
    height: 80,
  },
  headerTop: {
    backgroundColor: colors.qLightGreen,
  },
  quizText: {
    fontFamily: 'Fira Sans',
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
  },
  quizSubText: {
    fontFamily: 'Fira Sans',
    color: 'white',
    textAlign: 'center',
    paddingBottom: 15,
    fontSize: 17,
  },
  quizTextLive: {
    fontFamily: 'Fira Sans',
    color: 'white',
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 30,
    color: 'red'
  },
  headerText: {
    fontFamily: 'Fira Sans',
    color: 'white',
    textAlign: 'right',
    paddingTop: 10,
  },
  bigTitle: {
    fontFamily: 'Fira Sans',
    fontWeight: '600',
    flex: 3,
    fontSize: 35,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 25,
  },
  subTitle: {
    fontFamily: 'Fira Sans',
    fontWeight: '600',
    flex: 3,
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 10,
  },
  gradesListView: {
    paddingLeft: 10,
    flex: 2,
  },
  addButton: {
    color: 'white',
    width: 50,
    height: 50,
  },
  gradesListRow: {
    paddingVertical: 30,
  },
  courseListText: {
    fontFamily: 'Fira Sans',
    fontWeight: '600',
    flex: 1,
    fontSize: 30,
    color: 'white',
    textAlign: 'left',
  },
  addCourse: {
    flex: 3,
    flexDirection: 'row',
    paddingRight: 10,
    paddingBottom: 5,
    alignItems: 'flex-end',
  },
  addCourseText: {
    fontFamily: 'Fira Sans',
    fontWeight: '400',
    flex: 1,
    fontSize: 20,
    color: 'white',
    textAlign: 'right',
  }
});