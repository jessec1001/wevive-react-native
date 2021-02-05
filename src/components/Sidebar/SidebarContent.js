import React, {Component} from 'react';
import {Image, Text, StyleSheet, View, TouchableHighlight} from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';
import Icon from './../Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import defaultSidebarLinks from './SidebarLinks';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { redirectToNewParams } from '../../utils/helpers';
const backButton = null;
import {colors} from '../../../app.json';
export default class SidebarContent extends Component {
  constructor() {
    super();
    this.state = {
      sidebarLinks: defaultSidebarLinks,
      activeSections: [],
      sidebarTitle: null,
      sidebarCategory: null,
      previousSidebarLinks: [],
      previousSidebarTitle: [],
      previousSidebarCategory: [],
      styles: StyleSheet.create({
        menuItemWrapper: {
          borderStyle: 'solid',
          borderBottomWidth: 1,
          borderBottomColor: colors.contentBorder,
          marginLeft: responsiveWidth(3.5),
          marginRight: responsiveWidth(3.5),
          paddingHorizontal: responsiveWidth(2),
          flexDirection: "row",
        },
        accordionMenuItemWrapper: {
          marginLeft: responsiveWidth(0),
          marginRight: responsiveWidth(7.5),
          marginBottom: responsiveFontSize(1.5),
        },
        menuItem: {
          //fontFamily: 'Adelle',
          color: colors.sidebarText,
          fontSize: responsiveFontSize(2.2),
          fontWeight: "200",
          textTransform: "uppercase",
          padding: responsiveWidth(2),
          marginVertical: responsiveFontSize(1),
        },
        importantMenuItem: {
          //fontFamily: 'Adelle',
          color: colors.secondary,
          fontSize: responsiveFontSize(1.75),
          textTransform: 'uppercase',
        },
        accordionItem: {
          marginLeft: responsiveWidth(12.5),
          marginVertical: responsiveWidth(4),
          //fontFamily: 'Adelle',
          color: colors.sidebarText,
          fontSize: responsiveFontSize(2),
          fontWeight: "200",
        },
        textSelected: {
          color: colors.sidebarText,
          borderBottomColor: colors.sidebarText,
        },
        menuIcon: {
          fontSize: responsiveFontSize(2),
          color: colors.sidebarText,
          marginRight: 20,
          alignSelf: "center",
        },
        submenuIcon: {
          fontSize: responsiveFontSize(1.25),
          position: 'absolute',
          color: colors.sidebarText,
          right: responsiveWidth(7.5),
          top: 1,
        },
        sidebarCategory: {
          color: colors.sidebarText,
          fontSize: responsiveFontSize(1.75),
          fontFamily: 'Adelle',
          marginLeft: responsiveWidth(7.5),
          marginRight: responsiveWidth(7.5),
        },
        sidebarTitle: {
          fontSize: responsiveFontSize(1.85),
          color: colors.sidebarText,
          //fontFamily: 'Adelle',
        },
        sidebarTitleWrapper: {
          marginLeft: responsiveWidth(7.5),
          marginRight: responsiveWidth(7.5),
          borderBottomWidth: 2,
          borderBottomColor: colors.secondary,
          borderStyle: 'solid',
        },
        backButton: {
          //width:responsiveWidth(12.5),
          //height:responsiveHeight(2),
          marginLeft: responsiveWidth(7.5),
          marginTop: 15,
          marginBottom: 10,
        },
      })
    };
  }
  _renderSectionTitle = section => {
    return null;
  };

  _getOnPress = section => {
    if (typeof section.submenu !== 'undefined') {
      var onPress = () => {
        this.state.previousSidebarLinks.push(this.state.sidebarLinks);
        this.state.previousSidebarTitle.push(this.state.sidebarTitle);
        this.state.previousSidebarCategory.push(this.state.sidebarCategory);
        this.setState({
          activeSections: [],
          sidebarLinks: defaultSidebarLinks[section.submenu].items,
          sidebarCategory: defaultSidebarLinks[section.submenu].category,
          sidebarTitle: defaultSidebarLinks[section.submenu].text,
        });
      };
    } else {
      var onPress = () => {
        if (section.route) {
          if (section.route == 'SignIn') {
            AsyncStorage.removeItem('userToken');
            global.mainNavigation.navigate('Auth');
          } else if (section.route == 'Donate') {
            global.toggleDonationModal();
          } else {
            redirectToNewParams(this.props.navigation,this.props.route,section.route,section.routeParams);
          }
        }
        if (section.accordion && section.accordion.length) {
        } else {
          this.props.closeDrawer();
        }
      };
    }
    return onPress;
  };

  _renderHeader = (section, index, isActive, sections) => {
    if (isActive) {
      var addStyles = '';//'textSelected';
    } else {
      var addStyles = '';
    }
    if (!this.state.sidebarTitle) {
      if (section.important) {
        var mainStyle = 'importantMenuItem';
      } else {
        var mainStyle = 'menuItem';
      }
      var menuItemStyle = this.state.styles.menuItemWrapper;
    } else {
      var mainStyle = 'accordionItem';
      var menuItemStyle = this.state.styles.accordionMenuItemWrapper;
    }
    if (addStyles) {
      var textStyle = {...this.state.styles[mainStyle], ...this.state.styles[addStyles]};
    } else {
      var textStyle = this.state.styles[mainStyle];
    }
    if (typeof section.submenu !== 'undefined') {
      var icon = <Image name="arrowright" style={this.state.styles.submenuIcon} />;
    } else {
      var icon = null;
    }
    if (section.icon) {
      var menuIcon = <Icon name={section.icon} style={this.state.styles.menuIcon} />;
    } else {
      var menuIcon = null;
    }
    var text = <Text style={textStyle}>{section.title}</Text>;
    return (
      <TouchableOpacity
        onPress={() => {
          this._getOnPress(section)();
        }}
      >
        <View
                style={menuItemStyle}>
                {menuIcon}
                {text}
                {icon}
              </View>
      </TouchableOpacity>
      
    );
  };

  _renderContent = section => {
    return section.content ? (
      <View>
        {section.content}
      </View>
    ) : null;
  };

  _updateSections = newActiveSections => {
      this.setState({activeSections: newActiveSections});
  };

  render() {
    var SECTIONS = [];
    Object.keys(this.state.sidebarLinks).map(t => {
      var t = this.state.sidebarLinks[t];
      if (!t.hidden && !t.category) {

        if (this.props.drawerType != t.type) return;
        if (t.accordion) {
          var accordion = t.accordion.map(ac => {
            if (ac.icon) {
              var icon = <Icon name={ac.icon} style={this.state.styles.menuIcon} />;
            } else {
              var icon = null;
            }
            return (
              <TouchableOpacity onPress={() => {
                if (ac.submenu) {
                  this.state.previousSidebarLinks.push(
                    this.state.sidebarLinks,
                  );
                  this.state.previousSidebarTitle.push(
                    this.state.sidebarTitle,
                  );
                  this.state.previousSidebarCategory.push(
                    this.state.sidebarCategory,
                  );
                  this.setState({
                    activeSections: [],
                    sidebarLinks: defaultSidebarLinks[ac.submenu].items,
                    sidebarCategory: defaultSidebarLinks[ac.submenu].category,
                    sidebarTitle: defaultSidebarLinks[ac.submenu].text,
                  });
                }
                this._getOnPress(ac)();
              }}>
              <View
                style={this.state.styles.menuItemWrapper}
                >
                {icon}
                <Text style={this.state.styles.accordionItem}>{ac.text}</Text>
              </View>
              </TouchableOpacity>
            );
          });
        } else {
          var accordion = null;
        }
        SECTIONS.push({
          title: t.text,
          content: accordion,
          important: t.important,
          submenu: t.submenu,
          accordion: t.accordion,
          route: t.route,
          routeParams: t.routeParams,
          icon: t.icon,
        });
      }
    });

    return (
      <View style={{paddingBottom: responsiveHeight(13.5), flex: 1,alignSelf:"flex-start"}} sidebarLinks={this.state.sidebarLinks}>
        <View>
          {this.state.sidebarCategory ? (
            <Text style={this.state.styles.sidebarCategory}>
              {this.state.sidebarCategory}
            </Text>
          ) : null}
          {this.state.sidebarTitle ? (
            <View style={this.state.styles.sidebarTitleWrapper}>
              <Text style={this.state.styles.sidebarTitle}>{this.state.sidebarTitle}</Text>
            </View>
          ) : null}
          {this.state.sidebarTitle ? (
            <TouchableHighlight onPress={() => {
              this.setState({
                activeSections: [],
                sidebarLinks: this.state.previousSidebarLinks.pop(),
                sidebarTitle: this.state.previousSidebarTitle.pop(),
                sidebarCategory: this.state.previousSidebarCategory.pop(),
              });
            }}>
            <View>
              <Image
                source={backButton}
                style={this.state.styles.backButton}
              />
            </View>
            </TouchableHighlight>
          ) : null}
        </View>
        <Accordion
          sections={SECTIONS}
          activeSections={this.state.activeSections}
          renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
          underlayColor="rgba(0,0,0,0)"
          duration={700}
        />
      </View>
    );
  }
}

module.exports = SidebarContent;
