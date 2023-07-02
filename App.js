import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import entities from "./entities";
import Physics from "./physics";
import "expo-dev-client";
import {
  BannerAd,
  BannerAdSize,
  // TestIds,r
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

// const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6234148397207026~3358859453';
const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-6234148397207026/2337421827";

const adUnitId2 = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-6234148397207026/9369734036";

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        rewarded.show();
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
      }
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);
  useEffect(() => {
    setRunning(false);
  }, []);

  // if (!loaded) {
  //   return null;
  // }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 100 }}>
        <BannerAd
          unitId={adUnitId2}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
        <Button
          style={{}}
          title="Click for your Reward"
          onPress={() => {
            rewarded.show();
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          margin: 10,
          alignItems: "center",
          alignSelf: "center",
          zIndex: 100,
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "bold" }}>
          Score:
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "600",
            marginLeft: 5,
            marginTop: 2,
          }}
        >
          {currentPoints}
        </Text>
      </View>
      <GameEngine
        ref={(ref) => {
          setGameEngine(ref);
        }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={(e) => {
          switch (e.type) {
            case "game_over":
              setRunning(false);
              gameEngine.stop();
              break;
            case "new_point":
              setCurrentPoints(currentPoints + 10);
              break;
          }
        }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <StatusBar style="auto" hidden={true} />
      </GameEngine>

      {!running ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              paddingHorizontal: 30,
              paddingVertical: 10,
              borderRadius: 10,
            }}
            onPress={() => {
              setCurrentPoints(0);
              setRunning(true);
              gameEngine.swap(entities());
            }}
          >
            <Text style={{ fontWeight: "bold", color: "white", fontSize: 20 }}>
              START GAME
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* <View style={{ zIndex: 100,flex:1,marginBottom:0 }}> */}

      {/* </View> */}
    </View>
  );
}
