//鏁板瓧婊氬姩浠ｇ爜
$(document).ready(function(){
	function countUp(target, startVal, endVal, decimals, duration, options) {
	    this.options = options || {useEasing: true, useGrouping: true, separator: ',', decimal: '.'}
	    if (this.options.separator == '') this.options.useGrouping = false;
	    if (this.options.prefix == null) this.options.prefix = '';
	    if (this.options.suffix == null) this.options.suffix = '';
	    var self = this;
	    this.d = (typeof target === 'string') ? document.getElementById(target) : target;
	    this.startVal = Number(startVal);
	    this.endVal = Number(endVal);
	    this.countDown = (this.startVal > this.endVal) ? true : false;
	    this.startTime = null;
	    this.timestamp = null;
	    this.remaining = null;
	    this.frameVal = this.startVal;
	    this.rAF = null;
	    this.decimals = Math.max(0, decimals || 0);
	    this.dec = Math.pow(10, this.decimals);
	    this.duration = duration * 1000 || 2000;
	    this.version = function () {
	        return '1.3.3'
	    }
	    this.printValue = function (value) {
	        var result = (!isNaN(value)) ? self.formatNumber(value) : '--';
	        if (self.d.tagName == 'INPUT') {
	            this.d.value = result;
	        }
	        else if (self.d.tagName == 'text') {
	            this.d.textContent = result;
	        }
	        else {
	            this.d.innerHTML = result;
	        }
	    }
	    this.easeOutExpo = function (t, b, c, d) {
	        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
	    }
	    this.count = function (timestamp) {
	        if (self.startTime === null) self.startTime = timestamp;
	        self.timestamp = timestamp;
	        var progress = timestamp - self.startTime;
	        self.remaining = self.duration - progress;
	        if (self.options.useEasing) {
	            if (self.countDown) {
	                var i = self.easeOutExpo(progress, 0, self.startVal - self.endVal, self.duration);
	                self.frameVal = self.startVal - i;
	            } else {
	                self.frameVal = self.easeOutExpo(progress, self.startVal, self.endVal - self.startVal, self.duration);
	            }
	        } else {
	            if (self.countDown) {
	                var i = (self.startVal - self.endVal) * (progress / self.duration);
	                self.frameVal = self.startVal - i;
	            } else {
	                self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
	            }
	        }
	        if (self.countDown) {
	            self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
	        } else {
	            self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
	        }
	        self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;
	        self.printValue(self.frameVal);
	        if (progress < self.duration) {
	            self.rAF = requestAnimationFrame(self.count);
	        } else {
	            if (self.callback != null) self.callback();
	        }
	    }
	    this.start = function (callback) {
	        self.callback = callback;
	        if (!isNaN(self.endVal) && !isNaN(self.startVal)) {
	            self.rAF = requestAnimationFrame(self.count);
	        } else {
		        console && console.log('countUp error: startVal or endVal is not a number');
	            self.printValue();
	        }
	        return false;
	    }
	    this.stop = function () {
	        cancelAnimationFrame(self.rAF);
	    }
	    this.reset = function () {
	        self.startTime = null;
	        self.startVal = startVal;
	        cancelAnimationFrame(self.rAF);
	        self.printValue(self.startVal);
	    }
	    this.resume = function () {
	        self.stop();
	        self.startTime = null;
	        self.duration = self.remaining;
	        self.startVal = self.frameVal;
	        requestAnimationFrame(self.count);
	    }
	    this.update = function (newEndval) {
	        self.stop();
	        self.startTime = null;
	        self.startVal = self.endVal;
	        self.endVal = Number(newEndval);
	        self.countDown = (self.startVal > self.endVal) ? true : false;
	        self.rAF = requestAnimationFrame(self.count);
	    }
	    this.formatNumber = function (nStr) {
	        nStr = nStr.toFixed(self.decimals);
	        nStr += '';
	        var x, x1, x2, rgx;
	        x = nStr.split('.');
	        x1 = x[0];
	        x2 = x.length > 1 ? self.options.decimal + x[1] : '';
	        rgx = /(\d+)(\d{3})/;
	        if (self.options.useGrouping) {
	            while (rgx.test(x1)) {
	                x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
	            }
	        }
	        return self.options.prefix + x1 + x2 + self.options.suffix;
	    }
	    self.printValue(self.startVal);
	}

	$(function(){
	    var rateNumOptions = {useEasing: true, useGrouping: true, separator: '', decimal: '.', prefix: '', suffix: ''};
	    var rateFlag = true;
	    var rateArr = [];
	    $('.number-box .number-add').each(function (index) {
	        var stopNum = $(this).html();
	        var rateCountUp = new countUp(this, 0, stopNum, 0, 3, rateNumOptions);
	        rateArr.push(rateCountUp);
	    });
	    function numberAdd() {
	        var topOffset = $(this).scrollTop();
	        var topJudge = $('.number-box').offset().top - topOffset - $(window).innerHeight();
	        if (topJudge < -15 && rateFlag) {
	            rateFlag = false;
	            for (var i = 0; i < rateArr.length; i++) {
	                rateArr[i].start();
	            }
	        }
	    }
	    numberAdd();
	    $(window).scroll(numberAdd);
		
	});

});