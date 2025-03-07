export default {
  expo: {
    name: 'SQA',
    slug: 'test',
    owner: 'chikaturin',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSMicrophoneUsageDescription:
          'Ứng dụng cần quyền truy cập micro để ghi âm.',
      },
      NSFaceIDUsageDescription: 'We use Face ID to secure your AI key.',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.chikaturin.sqa',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    //cant set key here -- dont work
    extra: {
      eas: {
        projectId: '1b721f0e-cd82-45bf-bbce-07affc1f64aa',
      },
    },
  },
};
