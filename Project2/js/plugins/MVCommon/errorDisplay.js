//=============================================================================
// AltMenuScreen.js
//=============================================================================

/*:
 * @plugindesc Adds a better error display to catch errors
 * @author Maddie
 *
 * @help This plugin does not provide plugin commands.
 */

var MATTIE = MATTIE || {};
var MATTIE_RPG = MATTIE_RPG || {}

MATTIE.error = {};
MATTIE.error.headerText = '<font color="Yellow" size=5>The game has encountered an error, please report this.<br></font>';
MATTIE.error.bodyText = '<br> If you are reporting a bug, include this screen with the error and what mod/mods you were using and when you were doing when the bug occurred. <br> Thanks <br> -Mattie<br>';
//----------------------------------------------------------------
// Error Handling
//----------------------------------------------------------------




/**
 * @global
 * @description override the scene manager error functions with our own error screen instead
 */
MATTIE.overrideErrorLoggers = function () {
	SceneManager.onError = function (e) {
		MATTIE.onError.call(this, e);
	};

	SceneManager.catchException = function (e) {
		MATTIE.onError.call(this, e);
	};
};

Graphics.clearCanvasFilter = function () {
	if (this._canvas) {
		this._canvas.style.opacity = 1;
		this._canvas.style.filter = null;
		this._canvas.style.webkitFilter = null;
	}
};
Graphics.hideError = function () {
	this._errorShowed = false;
	this.eraseLoadingError();
	this.clearCanvasFilter();
};

/**
 * @description for the purpose of matching our error style to that of termina I have used Olivia's formatting below
 * variables names were changed to match coding convention of my modloader not to appear as though this is my code. That said this is like
 * borrowing a color.
 * @credit Olivia AntiPlayerStress
 */
MATTIE_RPG.Graphics_updateErrorPrinter = Graphics._updateErrorPrinter;
Graphics._updateErrorPrinter = function () {
	MATTIE_RPG.Graphics_updateErrorPrinter.call(this);
	this._errorPrinter.height = this._height * 0.5;
	this._errorPrinter.style.textAlign = 'left';
	this._centerElement(this._errorPrinter);
};

MATTIE.suppressingAllErrors = false;
/**
 * @global
 * @description the global method that handles all exceptions
 * @param {Error} e the error that was thrown
 */
MATTIE.onError = function (e) {
	if (!e.message.includes('greenworks-win32')) {
		if (!MATTIE.suppressingAllErrors) {
			console.error(e);
			console.error(e.message);
			console.error(e.filename, e.lineno);
			try {
				this.stop();
				const color = '#f5f3b0';
				let errorText = '';
				errorText += MATTIE.error.headerText;
				errorText += MATTIE.error.bodyText;
				errorText += '<br><font color="Yellow" size=5>Error<br></font>';
				if (e.stack) { errorText += e.stack.split('\n').join('<br>'); }
				if (e.message) { errorText += e.message; }
				if (e.lineno) { errorText += `<br>at Line:${e.lineno}`; }
				if (e.fileName) { errorText += `<br>File:${e.fileName}`; }
				if (e.name) { errorText += `<br>name:${e.name}`; }

				errorText += `<font color=${color}><br><br>Press 'F7' or 'escape' to try to continue despite this error. <br></font>`;
				errorText += `<font color=${color}>Press 'F9' to suppress all future errors. (be carful using this)<br></font>`;
				errorText += `<font color=${color}>Press 'F6' To reboot without mods.<br></font>`;
				errorText += `<font color=${color}>Press 'F5' to reboot with mods. <br></font>`;

				Graphics.printError('', errorText);
				AudioManager.stopAll();
				const cb = ((key) => {
					if (key.key === 'F6') {
						MATTIE_ModManager.modManager.disableAndReload();
						MATTIE_ModManager.modManager.reloadGame();
					} else if (key.key === 'F7' || key.key === 'Escape') {
						document.removeEventListener('keydown', cb, false);
						Graphics.hideError();
						if(SceneManager._stopped) this.resume();
					} else if (key.key === 'F5') {
						MATTIE_ModManager.modManager.reloadGame();
					} else if (key.key === 'F9') {
						MATTIE.suppressingAllErrors = true;
						document.removeEventListener('keydown', cb, false);
						Graphics.hideError();
						if(SceneManager._stopped) this.resume();
					}
				});
				document.addEventListener('keydown', cb, false);
			} catch (e2) {
				Graphics.printError('Error', `${e}<br>${e2.message}${e2.stack}<br>\nFUBAR`);
			}
		}
	}
};


/**
 * Make loading error less obtrusive
 *
 * @static
 * @method printLoadingError
 * @param {String} url The url of the resource failed to load
 */
Graphics.printLoadingError = function (url) {
	if (this._errorPrinter && !this._errorShowed && !MATTIE.ignoreWarnings) {
		this._errorPrinter.innerHTML = this._makeErrorHtml('Loading Error', `Failed to load: ${url}`);
		this._errorPrinter.style.fontSize = '16px';
		var button = document.createElement('button');
		button.innerHTML = 'Retry';
		button.style.fontSize = '16px';
		button.style.color = '#ffffff';
		button.style.backgroundColor = '#000000';
		var removeWarningsBtn = document.createElement('button');
		removeWarningsBtn.innerHTML = 'Ignore All Future Warnings';
		removeWarningsBtn.style.fontSize = '16px';
		removeWarningsBtn.style.color = '#ffffff';
		removeWarningsBtn.style.backgroundColor = '#000000';
		button.onmousedown = button.ontouchstart = function (event) {
			ResourceHandler.retry();
			event.stopPropagation();
		};

		removeWarningsBtn.onmousedown = button.ontouchstart = function (event) {
			ResourceHandler.retry();
			MATTIE.ignoreWarnings = true;
			event.stopPropagation();
		};
		this._errorPrinter.appendChild(button);
		this._errorPrinter.appendChild(removeWarningsBtn);
		this._loadingCount = -Infinity;
	}
};

/**
 * @global
 * @description override the scene manager error functions with our own error screen instead
 */
MATTIE.overrideErrorLoggers = function () {
	SceneManager.onError = function (e) {
		MATTIE.onError.call(this, e);
	};

	SceneManager.catchException = function (e) {
		MATTIE.onError.call(this, e);
	};
};


(()=>{
	MATTIE.overrideErrorLoggers();
})();