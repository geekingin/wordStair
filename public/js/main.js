$(function() {
	var words=[];
	$.get('api/words/all', function(data) {
		/*optional stuff to do after success */
		console.log(data.words);
		words=data.words;
		// $('.word').text(data.words.shift().word);
		showNextWord(data.words);
	});


	$('.action__disapear').on('click', function(e) {
		event.preventDefault();
		var word = $('.word').text();
		$.post('api/word/disapear', {
			word: word
		}, function(data, textStatus, xhr) {
			showNextWord();
			console.log('fd');
		});
	});

	$('.action__remember').on('click', function(e) {
		event.preventDefault();
		var word = $('.word').text();

		$.post('api/word/remember', {
			word: word
		}, function(data, textStatus, xhr) {
			showNextWord();

		});
	});

	$('.action__forget').on('click', function(e) {
		event.preventDefault();
		var word = $('.word').text();
		$.post('api/word/forget', {
			word: word
		}, function(data, textStatus, xhr) {
			showNextWord();
		});
	});

	function showNextWord(){
		$('.word').text(words.shift().word);
	}
});