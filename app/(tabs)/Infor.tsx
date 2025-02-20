import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

import { GOOGLE_VISION_API_KEY } from '@env';

const Infor = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 🎤 Bắt đầu ghi âm
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Ứng dụng cần quyền ghi âm!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (error) {
      console.error('Lỗi khi ghi âm:', error);
    }
  };

  // ⏹ Dừng ghi âm
  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      console.log('🎤 Ghi âm hoàn tất:', uri);
      convertToText(uri);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy file ghi âm!');
    }
  };

  // 🔄 Chuyển file thành base64 và gửi lên Google Speech-to-Text
  const convertToText = async (uri: string) => {
    setIsLoading(true);
    try {
      // Chuyển file thành base64
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Cấu hình request gửi lên Google
      const requestBody = {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: 'vi-VN', // Chuyển sang tiếng Việt
        },
        audio: {
          content: fileBase64,
        },
      };

      console.log(
        '📤 Gửi dữ liệu đến API:',
        JSON.stringify(requestBody, null, 2)
      );

      // Gửi request lên Google
      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_VISION_API_KEY}`,
        requestBody
      );

      console.log('📩 Phản hồi từ Google:', response.data);

      // Lấy kết quả nhận diện giọng nói
      if (response.data.results) {
        setTranscription(response.data.results[0].alternatives[0].transcript);
      } else {
        setTranscription('Không nhận diện được âm thanh.');
      }
    } catch (error) {
      console.error('🚨 Lỗi nhận diện giọng nói:', error);
      Alert.alert('Lỗi', 'Không thể gửi dữ liệu đến API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }} className="mt-10">
      <Text style={{ marginBottom: 10 }}>
        🎤 Kết quả: {transcription || 'Chưa có dữ liệu'}
      </Text>

      <Button
        title="🎙 Bắt đầu ghi âm"
        onPress={startRecording}
        disabled={!!recording}
      />
      <Button
        title="⏹ Dừng ghi âm"
        onPress={stopRecording}
        disabled={!recording}
      />

      {isLoading && <Text>⏳ Đang nhận diện giọng nói...</Text>}
    </View>
  );
};

export default Infor;
