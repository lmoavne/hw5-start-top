class Button
	@buttons = []
	@enable-other-buttons = (current) !-> [button.enable! for button in @buttons when button isnt current and button.state isnt "done"]
	@disalbe-other-buttons = (current) !-> [button.disable! for button in @buttons when button isnt current and button.state isnt "done"]
	@reset-all-buttons = !-> [button.reset! for button in @buttons]
	#console
	(@dom, @number-fetch-back) !->
		@state = 'enable'
		#@dom.add-class 'enable'
		@dom.click !~> if @state is 'enable'
			@@@disalbe-other-buttons @
			@wait!
			@dom.find '.unread'  .remove-class 'cancle-circle' .add-class 'red-circle'
			@dom.find '.unread' .text '...'
			@fetch-number-and-show!
			#@done
		@@@buttons.push @ #构造Buttonde时，通过外部的循环，然后给buttons数组赋值


	wait: !-> @state = "waiting"; @dom.remove-class 'enable' .add-class 'waiting'
	done: !-> @state = "done"; @dom.remove-class 'waiting' .add-class 'done'
	enable: !-> @state = "enable"; @dom.remove-class 'disable' .add-class 'enable'
	reset: !->
		@state = "enable"; @dom.remove-class 'waiting done disable' .add-class 'enable'
		@dom.find '.unread' .text ''
	disable: !-> @state = "disable"; @dom.remove-class 'enable' .add-class 'disable'

	@all-numbers-get = ->
		[return false for button in @buttons when button.state isnt 'done']
		true

	fetch-number-and-show: !-> $.get '/' (number, result) !~>
		@done!
		@dom.find '.unread' .text number
		##console.log @number-fetch-back
		@number-fetch-back number, number
		@@@bubble-can! if @@@all-numbers-get!
		@@@enable-other-buttons @

$ !->
	add-click-to-all-buttons!
	add-sum-to-bubble!
	#console.log 'fuck'
	add-leave-events-to-the-area!

add-sum-to-bubble = !->
	bubble = $ '.info'
	bubble.add-class 'disable'
	Button.bubble-can = !-> bubble.remove-class 'disable' .add-class 'enable'
	#console.log bubble.has-class 'enable'	
	bubble.click !-> if bubble.has-class 'enable'
		/*s = $ '.unread'
		#console.log s
		ss = 0
		for i from 0 to 4
			ss += s[i].text
		#console.log ss
		#console.log bubble.find '.result' .text*/
		bubble.find '.result' .text add-the-fetch-number-to-sum.sum

add-the-fetch-number-to-sum =
	sum:0
	add: (number)-> @sum += parse-int number
	reset: !-> @sum = 0

add-click-to-all-buttons = !->
	for let dom, i in $ '#button .button'
		button = new Button ($ dom), (error, number) !->
				#console.log "Error from #{button.name}, message is: #{error.message}"
				# number = error.data
			#console.log 'add'
			#console.log add-the-fetch-number-to-sum.sum
			add-the-fetch-number-to-sum.add number
			#console.log add-the-fetch-number-to-sum.sum

add-leave-events-to-the-area = !->
	$ '#button' .on 'mouseleave' !->
		#console.log 'reset'
		reset!

reset = !->
	add-the-fetch-number-to-sum.reset!
	Button.reset-all-buttons!
	reset-for-bubble!
	reset-circle!

reset-circle = !->
	($ '.unread').remove-class 'red-circle'
	#($ '#info .unread').add-class 'cancle-circle'

reset-for-bubble = !->
	bubble = $ '.info'
	#console.log bubble.find '.result'
	bubble.find '.result' .text ''
	#console.log 'bubble-reset'
