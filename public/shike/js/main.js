$(function() {
	var pictureTemp = $($('#picture-template').html());
	var masterTemp = $($('#master-template').html());
	var pairTemp = $($('#pair-template').html());

	// getPicture('http://shike.hustonline.net/share/picture', {
	// 	uid: '551ec22d3f30d142c43e037c',
	// 	img_id: '55267dc43f30d16a93b4e1e3'
	// },pictureTemp);

	getMaster('http://shike.hustonline.net/share/master', {
		uid: '551ec22d3f30d142c43e037c'
	}, masterTemp)

	function getMaster(url, data, template) {
		$.get(url, data, function(response) {
			console.log(response);
		});
	}

	function getPicture(url, data, template) {
		$.get(url, data, function(response) {

		});
	}

});