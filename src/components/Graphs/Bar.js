import {Dimensions, StyleSheet, Text, useColorScheme, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Animated, {
  FadeIn,
  LinearTransition,
  SlideInDown,
} from 'react-native-reanimated';
import {colors, random_color} from '../../utils';
import {SettingsContext} from '../../contexts';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeIn.springify().damping(20);
const _layout = LinearTransition.springify().damping(20);
/** 
@property {object} 
@params data object must contain labels, dataset
@overview Uses react-native-reanimated for animations
*/

const dimensions = Dimensions.get('window');
const Bar = ({heading, x_label, y_label, data, height = 300, width}) => {
  const [app_settings, setAppSettings] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const [color, setColor] = useState(random_color());
  const [barWidth, setBarWidth] = useState(0.0);
  const [maxItem, setMaxItem] = useState(0.0);

  let trial = {
    labels: ['One', 'Two', 'Three', 'Four', 'Five', 'six'],
    dataset: [100, 50, 60, 80, 90, 200],
  };

  useEffect(() => {
    setMaxItem(
      data.dataset.length > 0 ? Math.max(...data.dataset) : data.dataset[0],
    );

    setBarWidth((dimensions.width * 0.9) / data.labels.length);
  }, [data]);
  return (
    <Animated.View
      style={{
        width: '100%',
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        position: 'relative',
        display: 'flex',
      }}>
      <Text
        style={{
          color: app_colors.text_color,
          position: 'absolute',
          top: 0,
        }}>
        {heading ?? 'Bar graph'}
      </Text>
      <Text
        style={{
          color: app_colors.text_color,
          position: 'absolute',
          bottom: 0,
        }}>
        {x_label ?? 'X'}
      </Text>
      <View
        style={{
          position: 'absolute',
          left: 0,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{rotate: '0deg'}],
        }}>
        <Text
          style={{
            color: app_colors.text_color,
          }}>
          {y_label ?? 'Y'}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: app_colors.text_color,
          }}>
          {' '}
          {maxItem >= 1000 ? '* 100' : ''}
        </Text>
      </View>
      <Animated.View
        layout={_layout}
        style={{
          width: '70%',
          gap: 10,
          flexDirection: 'row',
          position: 'relative',
          height: '70%',
          borderLeftWidth: 1,
          borderBottomWidth: 1,
          borderColor: random_color(),
        }}>
        {/* Last item */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 5 * (height * 0.7 * 0.2),
            left: -24,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: app_colors.text_color,
            }}>
            {maxItem >= 1000
              ? parseInt((maxItem / 5) * 5 * 0.01)
              : parseInt((maxItem / 5) * 5)}
          </Text>
        </Animated.View>
        {/* End Last item */}

        {[1, 2, 3, 4, 5].map((item, index) => {
          //console.log(height,index*(maxItem/5));
          return (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                bottom: index * (height * 0.7 * 0.2),
                left: -24,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: app_colors.text_color,
                }}>
                {maxItem >= 1000
                  ? parseInt((maxItem / 5) * index * 0.01)
                  : parseInt((maxItem / 5) * index)}
              </Text>
            </Animated.View>
          );
        })}

        {/* added y  */}

        {/* <Animated.View
          style={{
            width: 10,
            backgroundColor: color,
            position: 'absolute',
            bottom: height * 0.7 * 0.2 * data.dataset.length,
            left: -10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              position: 'absolute',
              left: -20,
            }}>
            {maxItem >= 1000
              ? (maxItem / 5) * data.dataset.length * 0.001
              : (maxItem / 5) * data.dataset.length}
          </Text>
        </Animated.View> */}

        {/**end of added y */}

        {data?.labels &&
          data?.labels.map((item, index) => {
            let h = (data.dataset[index] / maxItem) * height * 0.7;
            //console.log(index*height*0.2,typeof h,isFinite(h));

            return (
              <Animated.View
                key={index}
                entering={_entering}
                exiting={_exiting}
                style={{
                  width: isFinite(barWidth - 10)
                    ? data.dataset.length < 3
                      ? 50
                      : barWidth - 10
                    : 0,
                  height: isFinite(h) ? h : 0,
                  backgroundColor: color,
                  position: 'absolute',
                  bottom: 0,
                  marginLeft:
                    index == 0
                      ? 5
                      : isFinite(index * barWidth)
                      ? index * barWidth
                      : 0,
                }}>
                <Text
                  style={{
                    color: app_colors.text_color,
                    position: 'absolute',
                    bottom: -35,
                    fontSize: 13,
                    transform: [
                      {
                        rotate: '20deg',
                      },
                    ],
                  }}>
                  {item.length > 10 ? item.substring(0, 10) : item}
                </Text>
              </Animated.View>
            );
          })}
      </Animated.View>
    </Animated.View>
  );
};

export default Bar;

const styles = StyleSheet.create({});
