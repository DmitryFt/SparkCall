package com.sparkcall

import android.os.Build
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle

//react-native-screens
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

//react-native-bootsplash
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {
	//react-native-screens and react-native-bootsplash override
    override fun onCreate(savedInstanceState: Bundle?) {
		supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
		RNBootSplash.init(this, R.style.BootTheme)
		super.onCreate(savedInstanceState);
    }

	override fun getMainComponentName(): String = "SparkCall"

	override fun createReactActivityDelegate(): ReactActivityDelegate =
		DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

	//picture in picture workaround (react-native-webrtc)
	override fun onUserLeaveHint() {
		super.onUserLeaveHint()

		if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
			return
		}

		val supportsPip = packageManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_PICTURE_IN_PICTURE)
		if (!supportsPip || isInPictureInPictureMode || !PipControlModule.callPipEnabled) {
			return
		}

		try {
			enterPictureInPictureMode()
		} catch (_: Exception) {
			return
		}
	}
}
