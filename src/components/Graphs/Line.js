import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  FadeIn,
  LinearTransition,
  SlideInDown,
} from 'react-native-reanimated';
import {random_color} from '../../utils';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeIn.springify().damping(20);
const _layout = LinearTransition.springify().damping(20);
/** 
@property {object} 
@params data object must contain labels, dataset
@overview Uses react-native-reanimated for animations
*/

const dimensions = Dimensions.get('window');
const Line = ({heading, x_label, y_label, data, height = 300, width}) => {
  const [color, setColor] = useState(random_color());
  const [barWidth, setBarWidth] = useState(0.0);
  const [maxItem, setMaxItem] = useState(0.0);

  let trial = {
    labels: ['One', 'Two', 'Three', 'Four', 'Five', 'six'],
    dataset: [100, 50, 60, 80, 90, 200],
  };

  useEffect(() => {
    setMaxItem(Math.max(...data.dataset));

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
          position: 'absolute',
          top: 0,
        }}>
        {heading ?? 'Bar graph'}
      </Text>
      <Text
        style={{
          position: 'absolute',
          bottom: 0,
        }}>
        {x_label ?? 'X'}
      </Text>
      <View
        style={{
          position: 'absolute',
          left: 0,
        }}>
        <Text
          style={{
            color: '#fff',
          }}>
          {y_label ?? 'Y'}
        </Text>
        <Text
          style={{
            fontSize: 10,
          }}>
          {' '}
          {maxItem >= 1000 ? '* 1000' : ''}
        </Text>
      </View>
      <Animated.View
        layout={_layout}
        style={{
          width: '70%',
          gap: 10,
          flexDirection: 'row',
          position: 'relative',
          height: '45%',
          borderLeftWidth: 1,
          borderBottomWidth: 1,
          borderColor: random_color(),
        }}>
        {data?.labels &&
          data?.labels.map((item, index) => {
            //console.log(height,index*(maxItem/5));

            return (
              <Animated.View
                key={index}
                style={{
                  width: 10,
                  backgroundColor: color,
                  position: 'absolute',
                  bottom: index * (height * 0.45 * 0.2),
                  left: -10,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    position: 'absolute',
                    left: -20,
                  }}>
                  {maxItem >= 1000
                    ? (maxItem / 5) * index * 0.001
                    : (maxItem / 5) * index}
                </Text>
              </Animated.View>
            );
          })}

        {data?.labels &&
          data?.labels.map((item, index) => {
            let h = (data.dataset[index] / maxItem) * height * 0.45;
            //console.log(index*height*0.2,typeof h,isFinite(h));
            let hypotenuse = 0;
            let heightToNext = 0;
            let angle;
            if (index < data.dataset.length) {
              heightToNext =
                (data.dataset[index + 1] / maxItem) * height * 0.45;
            }

            let widthToNext = barWidth;

            if (isFinite(heightToNext) && isFinite(h)) {
              let difference = heightToNext - h;
              hypotenuse = Math.sqrt(
                barWidth * barWidth + difference * difference,
              );
              angle = Math.acos(barWidth / hypotenuse) * 360;
            }
            console.log(angle, h, hypotenuse);

            return (
              <Animated.View
                key={index}
                entering={_entering}
                exiting={_exiting}
                style={{
                  width: isFinite(hypotenuse) ? hypotenuse : barWidth,
                  height: 2,
                  backgroundColor: 'red',
                  position: 'absolute',
                  bottom: isFinite(h) ? h : 0,
                  marginLeft: index == 0 ? 5 : index * barWidth,
                  transformOrigin: 'left',
                  transform: [
                    {
                      rotate:
                        index == 0
                          ? '0deg'
                          : index < data.dataset.length
                          ? data.dataset[index] > data.dataset[index + 1]
                            ? `${angle??0}deg`
                            : `-${angle??0}deg`
                          : '0deg',
                    },
                  ],
                }}>
                <Text
                  style={{
                    position: 'absolute',
                    bottom: -25,
                  }}>
                  {item.length > 3 ? item.substring(0, 3) : item}
                </Text>
              </Animated.View>
            );
          })}
      </Animated.View>
    </Animated.View>
  );
};

const Connector = ({current, next}) => {
  return <View />;
};

export default Line;

const styles = StyleSheet.create({});
