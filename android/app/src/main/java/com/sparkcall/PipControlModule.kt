package com.sparkcall

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PipControlModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
	companion object {
		@Volatile
		var callPipEnabled: Boolean = false
	}

	override fun getName(): String = "PipControlModule"

	@ReactMethod
	fun setCallPipEnabled(enabled: Boolean) {
		callPipEnabled = enabled
	}
}
