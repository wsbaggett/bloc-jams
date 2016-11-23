var setSong = function(songNumber) {
 // new function for assignment 19  
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    
    currentlyPlayingSongNumber = parseInt(songNumber); 
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });
    
    setVolume(currentVolume);
};

var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.seek-control .current-time').text(currentTime);
 };

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.seek-control .total-time').text(totalTime);
 };

var filterTimeCode = function(timeInSeconds) {
    parseFloat(timeInSeconds);
    var roundedSecs = Math.floor(timeInSeconds);
    var fullMins = Math.floor(roundedSecs / 60);
    var fullSecs = Math.floor(roundedSecs%60);
    
    return fullMins + ":" + fullSecs;
};

var getSongNumberCell = function(number) {
    // new function for assignment 19
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
    
    var clickHandler = function() {
         // clickHandler logic
        var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) {
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	if (currentlyPlayingSongNumber !== songNumber) {
             // Switch from Play -> Pause button to indicate new song is playing.
             setSong(songNumber);
             currentSoundFile.play();
             updateSeekBarWhileSongPlays();
             $(this).html(pauseButtonTemplate);
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        
             var $volFill = $('.volume .fill');
             var $volThumb = $('.volume .thumb');
             $volFill.width(currentVolume + '%');
             $volThumb.css({left: currentVolume + '%'});
        
             updatePlayerBarSong();
         } else if (currentlyPlayingSongNumber === songNumber) {
		  if (currentSoundFile.isPaused()) {
               $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
	      }
    };
    
    var onHover = function(event) {
         // Placeholder for function logic
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
     };
     var offHover = function(event) {
         // Placeholder for function logic
         var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
     };
    
     // #1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
 };

var setCurrentAlbum = function(album) {
     // #1
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
      
             setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
             
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         // #3
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         // #4
         var seekBarFillRatio = offsetX / barWidth;
         
         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
            setVolume(seekBarFillRatio * 100);   
        }
 
         // #5
         updateSeekPercentage($(this), seekBarFillRatio);
     });
    
    // #7
     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();
 
         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
            setVolume(seekBarFillRatio * 100);   
             }
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var nextSong = function() {
    // function for next button
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousSongNum = currentIndex + 1;
    currentIndex++;
    if (currentIndex >= currentAlbum.songs.length) {
        currentIndex = 0;
    }
    setSong(currentIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist); 
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $previousSongNumberCell = getSongNumberCell(previousSongNum);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $previousSongNumberCell.html(previousSongNum);
};

var previousSong = function() {
    // function for previous button
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var lastSongNum = currentIndex + 1;
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentAlbum.songs.length -1;
    }
    setSong(currentIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist); 
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNum);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNum);
};

var updatePlayerBarSong = function() {
  // new function to update song bar
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist); 
    
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;
 var currentTime = null;
 var totalTime = null;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });