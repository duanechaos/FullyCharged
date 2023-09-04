/**
	showoff.global.js - shared JS code between all parts of the system ( frontend )
*/

   function getMeSomeTags(title,contentArray,existing) {
    //we put title first as it is a given
    text = title;
    //we start the minimum check to 1 as we will be looking only at title at the moment
    min = 1;
    // we check if we have any additional content to harvest
    if ( contentArray.length )
       {  // we loop through the expected array of texts
       	  for ( z = 0; z < contentArray.length; z++ )
              {
             	text = text + " " + contentArray[z];
              }
          //we will increase the minimum check depending on the length of the text
          if ( text.length < 4000 ) { min = 2; } else { min = 3; }
          //if there is more than a title, we add title again to make sure that title alone will produce tags
          text = text + " " + title;
       }
   	//incoming content, first we change everything to lower case
   	text = text.toLowerCase();
   	//must get rid of any html
   	text = text.replace(/<(?:.|\n)*?>/gm, '');
   	//this is the aaproved list of stop words in english
    var stopWords = ["quot", "ltd", "amp", "nbsp", "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
    //we clear the text from the stop words and panctuation
    var re = new RegExp('\\b(' + stopWords.join('|') + ')\\b', 'g');
    text = (text || '').replace(re, '').replace(/[ ]{2,}/, ' ');
    text = text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    // Show results with at least .. occurrences
    var atLeast = min;
    // we look for combinations of up to 3 words
    var numWords = 0;
    // looping vars
    var i, j, k, m, textlen, len, s;
    // a word boundary with length zero is empty
    var keys = [null];
    // we initialise the output
    var results = [];
    //for human logic, we start counting at 1 instead of 0
    numWords++;
    for (i=1; i<=numWords; i++)
        { keys.push({}); }
    text = text.split(/\s+/);
    for (i=0, textlen=text.length; i<textlen; i++)
        {
           s = text[i];
           keys[1][s] = (keys[1][s] || 0) + 1;
           for (j=2; j<=numWords; j++)
               {
                 if(i+j <= textlen) { s += " " + text[i+j-1]; keys[j][s] = (keys[j][s] || 0) + 1; } else break;
               }
        }
    //we create a structure of words and phrases and their number of occurences (as long they are above the min)
    for (var k=1; k<=numWords; k++)
        {
          var key = keys[k];
          for (var i in key)
              {
                if( key[i] >= atLeast ) results.push({word:i,times:key[i]});
              }
        }
    //we sort according to occurences
    results.sort(SortByTimes);
    //we want only the top 20 results
    results = results.slice(0, 21);
    //this will host the clean results
    var cleanResults = [];
    //we strip the counter key for the final results array
    for (var m = 0; m < results.length; m++)
        {
          cleanResults.push(results[m].word);
        }
    //we create the existing old tags into an array
    var array_exist = existing.split(',');
    //we clear of any duplicates
	cleanResults = cleanResults.concat(array_exist.filter(function (item) { return cleanResults.indexOf(item) < 0; }));
	//or any empty, undefined, nasty stuff that may have snicked in
	cleanResults = cleanResults.filter(function(e){return e});
    // finally, we re-sort the results alphabetically
    cleanResults.sort();
    //finally!!
    return cleanResults
}

function SortByTimes(a, b){
 var x = a.times; var y = b.times;
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}

var _paq = _paq || [];
$(document).on('click','.js-tab-toggle',function(){
	if ($(this).text().trim() !== '') {
		_paq.push(['trackEvent', 'tab', $(this).text().trim()]);
	}
});
$(document).on('click','form #vCalSubmitButton',function(){
	var formObj = $(this).closest('form');
	var _piwikAction = formObj.find('#name').val();
	var _piwikName = formObj.find('#startTime').val()+' - '+formObj.find('#endTime').val();
	_paq.push(['trackEvent', 'vcal', _piwikAction,_piwikName ]);
});


