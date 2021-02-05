import {StyleSheet} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';

import {colors} from "../../app.json";

const textColor = 'black';
const backgroundColor = 'rgb(240,240,240)';

const styles = keyboard => {
  return StyleSheet.create({
    bigHeadlineText: {
      fontSize: responsiveFontSize(3),
      //fontFamily: 'Adelle-Bold',
    },
    tick: {
      width: responsiveWidth(22),
      height: responsiveWidth(22),
      marginBottom: responsiveWidth(3),
    },
    successText: {
      //fontFamily: 'Adelle-Bold',
      fontSize: responsiveFontSize(1.8),
      lineHeight: responsiveFontSize(2.4),
      textAlign: "center",
      paddingHorizontal: responsiveWidth(12),
      paddingVertical: responsiveWidth(3),
    },
    blackButton: {
      backgroundColor: "black",
      paddingHorizontal: 50,
      borderRadius: 12,
      paddingVertical: 10,
    },
    blackButtonText: {
      color: "white",
      //fontFamily: 'Adelle-Bold',
      fontSize: responsiveFontSize(3),
    },
    headlineStyle: {
      paddingRight: responsiveWidth(20),
      paddingLeft: responsiveWidth(20),
      fontSize: responsiveFontSize(3),
      textAlign: 'center',
      color: textColor,
      fontWeight: "800",
      marginTop: 20,
      marginBottom: 20,
      //fontFamily: 'Adelle-Bold',
    },
    pageHeadlineStyle: {
      marginTop: responsiveWidth(5),
      marginBottom: responsiveWidth(5),
      fontSize: responsiveFontSize(2.3),
      textAlign: 'center',
    },
    mainLogoStyle: {
      width: responsiveWidth(50),
      height: responsiveWidth(16),
    },
    mainLogoContainerStyle: {
      backgroundColor: backgroundColor,
      padding: responsiveWidth(1.5),
      marginBottom: responsiveWidth(1.5),
      width: responsiveWidth(100),
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      borderBottomColor: "rgb(227,140,57)",
      borderBottomWidth: 2,
    },
    mainLogoImageStyle: {
      resizeMode: "contain",
    },
    mainHeadlineStyle: {
      color: textColor,
      fontSize: responsiveFontSize(2.55),
      fontWeight: "700",

    },
    codeHeadlineStyle: {
      color: textColor,
      fontSize: responsiveFontSize(2.55),
      fontWeight: "700",
      marginBottom: responsiveWidth(10),
      textAlign: "center",
    },
    errorStyle: {
      fontSize: responsiveFontSize(1.75),
      color: textColor,
      top: -responsiveHeight(1),
      left: responsiveWidth(3),
    },
    spinnerStyle: {
      color: 'black',
      overlayColor: 'rgba(0, 0, 0, 0.00)'
    },
    spinnerTextStyle: {
      color: 'black'
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginBottom: responsiveHeight(18),
      flex: 1,
      position: "relative",
      zIndex: 10,
    },
    logo: {
      width: 138*1.2,
      height: 151*1.2,
      position: "absolute",
      bottom: 30,
      right: 0,
      opacity: 0.15,
    },
    logo2: {
      width: 111*1.6,
      height: 25*1.6,
      position: "absolute",
      bottom: 32,
      left: responsiveWidth(50),
      marginLeft: -111*1.6/2,
    },
    footerStyle: {
      marginTop: responsiveHeight(2),
      fontSize: responsiveFontSize(1.65),
      color: textColor,
      //fontFamily: 'Adelle-Bold',
      textAlign: 'center',
    },
    linkStyle: {
      marginTop: responsiveHeight(1),
      paddingBottom: 1,
      fontSize: responsiveFontSize(2.5),
      color: textColor,
      //fontFamily: 'Adelle',
      zIndex: 9,
    },
    inputStyle: {
      textAlign: 'left',
      fontSize: responsiveHeight(2.5),
      padding: responsiveHeight(2.5),
      paddingLeft: responsiveWidth(13.5),
      marginTop: responsiveHeight(0),
      //fontFamily: 'Adelle',
      color: 'black',
    },
    inputContainerStyle: {
      marginBottom: responsiveHeight(2),
      backgroundColor: 'transparent',
      //borderRadius: 3,
      borderBottomWidth: 1,
      borderColor: 'black',
      width: responsiveWidth(80),
      //alignItems: "center",
      flexDirection: "column",
    },
    buttonContainerStyle: {
      marginTop: responsiveHeight(0),
      marginBottom: responsiveHeight(3),
      width: undefined,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      zIndex: 9,
    },
    footerText: {
      color: '#dbdbdb',
      //fontFamily: 'Adelle',
      fontSize: responsiveFontSize(5.95),
      textAlign: 'center',
      opacity: 0.4,
      paddingBottom: responsiveHeight(10),
      position: 'absolute',
      width: '100%',
      bottom: 0,
      zIndex: 2,
    },
    wildfooter: {
      tintColor: '#02754a',
      width: responsiveWidth(100),
      position: 'absolute',
      bottom: responsiveHeight(8.5),
      height: !keyboard ? responsiveWidth(100) / 5.91 : 0,
      zIndex: 2,
    },
    headerFooter: {
      position: 'absolute',
      tintColor: '#02754a',
      top: responsiveHeight(10.5),
      height: responsiveWidth(100) / 34.09,
      width: responsiveWidth(100),
      zIndex: 1,
    },
    headerBackground: {
      height: responsiveHeight(10.5),
      width: responsiveWidth(100),
      backgroundColor: colors.main,
      position: 'absolute',
      top: 0,
    },
    headerLogoContainer: {
      position: 'absolute',
      top: responsiveHeight(2.5),
      height: responsiveHeight(8)
    },
    headerLogoContainerFlex: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      flexDirection: 'column',
      flex: 1,
      width: responsiveWidth(100),
    },
    headerLogo: {
      top: 10,
      width: responsiveWidth(50),
      height: responsiveWidth(50) / 4.303,
    },
    contentBg: {
      width: responsiveWidth(100),
      flex:1,
    },
    bgStyle: {
      opacity: 0.3,
    },
    forgotPasswordLink: {
      fontSize: responsiveFontSize(1.8),
      marginTop: responsiveWidth(10),
    },
    footerBackground: {
      height: !keyboard ? responsiveHeight(8.5) : 0,
      width: responsiveWidth(100),
      backgroundColor: '#02754a',
      position: 'absolute',
      bottom: 0,
      zIndex: 2,
    },
    tocStyle: {
      marginTop: responsiveHeight(1.5),
    },
    activeDot: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
    },
    dot: {
      width: responsiveWidth(8),
      height: responsiveWidth(8),
      borderRadius: responsiveWidth(4),
      backgroundColor: textColor,
      borderColor: colors.main,
      borderWidth: 1,
      zIndex: 3,
      justifyContent: "center",
      marginHorizontal: responsiveWidth(1),
      
    }, 
    dotText: {
      color:  "rgb(100,100,100)",
      fontSize: responsiveFontSize(1.7),
      textAlign: "center",
    },
    activeDotText: {
      color:  colors.main,
    },
    swiperContainer: {
      justifyContent: "center",
      height: "auto"
    }, 
    swiperWrapper: {
      justifyContent: "center",
      height: "auto",
    },
    slide: {
      justifyContent: "center",
      marginTop: responsiveWidth(10),
      marginHorizontal: responsiveWidth(10),
      height: "auto",
    },
    slideContainer: {
      height: "auto",
    },
    paginationLine: {
      borderColor: "rgb(200,200,200)",
      borderBottomWidth: 1,
      position: "absolute",
      left: responsiveWidth(20),
      width: responsiveWidth(60),
      marginLeft: -responsiveWidth(12.5),  
    },
    buttonWrapperStyle: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      top: -responsiveWidth(3.5),
      position: "absolute",
      width: responsiveWidth(75),
      alignSelf: "center",
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: responsiveWidth(10),
    },
    countryFlag: {
      width: responsiveWidth(14.5),
      height: responsiveWidth(6),
      position: "absolute",
      top: responsiveWidth(5),
      left: -responsiveWidth(2.5),
    },
    countryCode: {
      width: responsiveWidth(12.5),
      height: responsiveWidth(5),
      position: "absolute",
      top: responsiveWidth(5.5),
      fontSize: responsiveFontSize(1.55),
      fontWeight: "200",
      textAlign: "center",
    },
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 100,
      justifyContent: "center",
      alignSelf: "center",
    }
  });
};
export default styles;
