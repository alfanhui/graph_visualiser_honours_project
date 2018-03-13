/* Code written by borismus from GitHub 23rd of June 2014
* https://github.com/borismus/MagicTouch
*
* Framework for simulating touch events without a mobile device
* Trying to be compatible with
* http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
* TODO: support more of the touch API: touch{enter, leave, cancel}
*/ 
let tuio = {
	cursors: [],

  // Data structure for associating cursors with objects
	_data: {},

  _touchstart:    function(touch) {
    // Create a touchstart event
    console.log("TUIO TOUCH START");// eslint-disable-line
    this._create_event('touchstart', touch, {});
  },

  _touchmove: function(touch) {
    // Create a touchmove event
    //console.log("MOVING!!!");// eslint-disable-line
    this._create_event('touchmove', touch, {});
  },

  _touchend: function(touch) {
    // Create a touchend event
    //console.log("ENDING!!!");// eslint-disable-line
    this._create_event('touchend', touch, {});
  },

  _create_event: function(name, touch, attrs) {
    // Creates a custom DOM event
    let evt = document.createEvent('CustomEvent');
    evt.initEvent(name, true, true);
    // Attach basic touch lists
    evt.touches = this.cursors;
    // Get targetTouches on the event for the element
    evt.targetTouches = this._get_target_touches(touch.target);
    evt.changedTouches = [touch];
    // Attach custom attrs to the event
    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        evt[attr] = attrs[attr];
      }
    }
    // Dispatch the event
    if (touch.target) {
      touch.target.dispatchEvent(evt);
    } else {
      document.dispatchEvent(evt);
    }
  },

  _get_target_touches: function(element) {
    let targetTouches = [];
    for (let i = 0; i < this.cursors.length; i++) {
      let touch = this.cursors[i];
      if (touch.target == element) {
        targetTouches.push(touch);
      }
    }
    return targetTouches;
  },

	// Callback from the main event handler
	callback: function(type, sid, fid, x, y, angle) {// eslint-disable-line
    //console.log('callback type: ' + type + ' sid: ' + sid + ' fid: ' + fid);
    console.log("callback: x:", x, ", y:",y,", pageX:", window.innerWidth * x, ", pageY:", window.innerHeight * y); // eslint-disable-line
		let data;

		if (type !== 3) {
			data = this._data[sid];
		} else {
			data = {
				sid: sid,
				fid: fid
			};
			this._data[sid] = data;
		}

    // Some properties
    // See http://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
    data.identifier = sid;
    data.pageX = window.innerWidth * x;
    data.pageY = window.innerHeight * y;
    data.clientX = window.innerWidth * x; //Added by Stuart Huddy
    data.clientY = window.innerHeight * y; //Added by Stuart Huddy
    data.target = document.elementFromPoint(data.pageX, data.pageY);

		switch (type) {
			case 3:
				this.cursors.push(data);
				this._touchstart(data);
				break;

			case 4:
				this._touchmove(data);
				break;

			case 5:
				this.cursors.splice(this.cursors.indexOf(data), 1);
				this._touchend(data);
				break;

			default:
				break;
		}

		if (type === 5) {
			delete this._data[sid];
		}
	}

};

function tuio_callback(type, sid, fid, x, y, angle)	{ // eslint-disable-line
	tuio.callback(type, sid, fid, x, y, angle);
}