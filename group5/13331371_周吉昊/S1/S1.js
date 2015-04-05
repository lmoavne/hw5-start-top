// Generated by CoffeeScript 1.9.1
(function() {
  var Button, clickTheBubbleAndCaculateTheSum, countSum, resetBubble, resetIfLeaveTheApb, startClickButtonsAndFetchDataFromServer;

  Button = (function() {
    Button.prototype.buttons = [];

    Button.prototype.disableAllOtherButtonsExcept = function(thisButton) {
      var button, i, j, len, ref, results;
      ref = Button.prototype.buttons;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        button = ref[i];
        if (button !== thisButton && button.state === "enable") {
          button.state = "disable";
          results.push(button.dom.css("background-color", "#686868"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Button.prototype.enableButtons = function() {
      var button, j, len, ref, results;
      ref = Button.prototype.buttons;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        button = ref[j];
        if (button.state === "disable" && button.state !== "done") {
          button.state = "enable";
          results.push(button.dom.css("background", "rgb(48, 63, 159)"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Button.prototype.ifAllButtonsAreDoneEnableTheBubble = function() {
      var button, j, len, ref;
      ref = Button.prototype.buttons;
      for (j = 0, len = ref.length; j < len; j++) {
        button = ref[j];
        if (button.state !== "done") {
          return;
        }
      }
      $('#info-bar').attr('enable', 'true');
      $('#info-bar').css('background-color', 'rgb(48, 63, 159)');
      return $('#info-bar').find("#sum").text("OK");
    };

    Button.prototype.resetAllButtons = function() {
      var button, dom, j, len, ref, results;
      ref = Button.prototype.buttons;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        button = ref[j];
        button.state = "enable";
        dom = button.dom;
        dom.css('background-color', 'rgb(48, 63, 159)');
        results.push(dom.find('.adder').css('display', 'none').text(''));
      }
      return results;
    };

    function Button(dom1) {
      this.dom = dom1;
      this.addClickHandler();
      this.state = "enable";
      Button.prototype.buttons.push(this);
    }

    Button.prototype.addClickHandler = function() {
      return this.dom.click((function(_this) {
        return function() {
          if (_this.state !== "enable") {

          } else {
            _this.dom.find(".adder").css('display', 'block').text("...");
            Button.prototype.disableAllOtherButtonsExcept(_this);
            _this.state = "disable";
            return _this.getRandomNumberFromTheServer();
          }
        };
      })(this));
    };

    Button.prototype.getRandomNumberFromTheServer = function() {
      return $.get("/", (function(_this) {
        return function(data) {
          _this.dom.find(".adder").text(data);
          _this.state = "done";
          _this.dom.css('background-color', '#686868');
          Button.prototype.enableButtons();
          return Button.prototype.ifAllButtonsAreDoneEnableTheBubble();
        };
      })(this));
    };

    return Button;

  })();

  $(function() {
    startClickButtonsAndFetchDataFromServer();
    clickTheBubbleAndCaculateTheSum();
    return resetIfLeaveTheApb();
  });

  startClickButtonsAndFetchDataFromServer = function() {
    var button, dom, j, len, ref, results;
    ref = $("#control-ring li");
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      dom = ref[j];
      results.push(button = new Button($(dom)));
    }
    return results;
  };

  clickTheBubbleAndCaculateTheSum = function() {
    var bubble;
    bubble = $("#info-bar");
    bubble.attr("enable", "false");
    return bubble.click((function(_this) {
      return function() {
        if (bubble.attr("enable") === 'true') {
          bubble.find("#sum").text(countSum());
          bubble.attr("enable", "false");
          return bubble.css('background-color', '#686868');
        }
      };
    })(this));
  };

  countSum = function() {
    var dom, j, len, number, ref, result;
    result = 0;
    ref = $('#control-ring li');
    for (j = 0, len = ref.length; j < len; j++) {
      dom = ref[j];
      number = $(dom).find('.adder').text();
      result += parseInt(number);
    }
    return result;
  };

  resetIfLeaveTheApb = function() {
    return $('#at-plus-container').on('mouseleave', function() {
      Button.prototype.resetAllButtons();
      return resetBubble();
    });
  };

  resetBubble = function() {
    var bubble;
    bubble = $('#info-bar');
    bubble.find('span').text('');
    bubble.attr('enabled', 'false');
    return bubble.css('background-color', '#686868');
  };

}).call(this);
