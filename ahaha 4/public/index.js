var jsonDoc;
var tmjsonDoc;
var url="http://ip-api.com/json";
window.onload=function loadJSON () {
	var xmlhttp=new XMLHttpRequest(); 
	xmlhttp.overrideMimeType("application/json");
	xmlhttp.open("GET",url,false); 
	xmlhttp.send(); 
	jsonDoc=xmlhttp.responseText;
	jsonDoc=JSON.parse(jsonDoc);
	var str = jsonDoc;
	cancelid('searchbutton');
	//alert(jsonDoc);

}

/*function loadform(){
  	var formobj={};
  	formobj['keyword']=document.getElementById('keyword').value;
  	var formjson=[];
  	formjson.push(formobj);
  	var xmlreq = new XMLHttpRequest();
  	xmlreq.open('post','/form',true);
  	xmlreq.send(document.getElementById('keyword').value);
  	console.log(formjson);

}*/

$(function(){				
    $('#searchbutton').click(function(e){
        e.preventDefault();
        console.log('select_link clicked');
        var data = {};
		data.keyword = document.getElementById('keyword').value;
		data.category = document.getElementById('category').value;
		data.distance = document.getElementById('distance').value;
		data.mileorkm = document.getElementById('mileorkm').value;
		data.distance = document.getElementById('distance').value;
		data.choosehere = document.getElementById('choosehere').value;
		data.choosethere = document.getElementById('choosethere').value;
		data.remote = document.getElementById('remote').value;
		data.lathere = jsonDoc['lat'];
		data.lonhere = jsonDoc['lon'];
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
            url: 'http://localhost:3000/endpoint',						
            success: function(data) {
                 console.log('success');
                 console.log(JSON.stringify(data));
             }
        });


		var tmxmlhttp=new XMLHttpRequest(); 
		tmxmlhttp.overrideMimeType("application/json");
		tmxmlhttp.open("GET",'/event',false); 
		tmxmlhttp.send(); 
		tmjsonDoc=tmxmlhttp.responseText;
		tmjsonDoc=JSON.parse(tmjsonDoc);
		var html = generateHTML(tmjsonDoc);
		if(tmjsonDoc!=null){
			document.getElementById("eventtable").innerHTML=html;
		}

    });				
});

function generateHTML(objson){
			root=objson.DocumentElement;
			var html_text="";
			html_text+="<table id='table'><tr>"
			html_text+= "<th>#</th>";
			html_text+= "<th>Date</th>";
			html_text+= "<th>Event</th>";
			html_text+= "<th>Category</th>";
			html_text+= "<th>Venue</th>";
			html_text+= "<th>Favorite</th>";
			html_text+="</tr>";
			if(objson.page.totalElements==0){
				html_text="<div id = 'errormessage'>No Records has been found</div>";
				return html_text;
			}
			
			var row = objson._embedded.events;
			for(var i in row){
				html_text += "<tr>";
					html_text+="<td>";
					html_text+=i;
					html_text += "</td>";

					html_text += "<td>";
					if(row[i]['dates']["start"]["localDate"]!=null)
					html_text += row[i]['dates']["start"]["localDate"];
					else html_text+="N/A";

					
					html_text += "<td>";
					html_text +="<form action='' method ='post' > ";
					if(row[i]['name']!=null){
					html_text += "<input type = 'submit' name='eventnames' class='eventnames'  value='"+row[i]['name']+"'>";
					html_text +="<input type='hidden' name = 'eventid' value = '"+row[i]['id']+"'>";
					
					html_text +="<input type='hidden' name = 'venue' value = '"+row[i]['_embedded']['venues'][0]['name']+"'>";
					}
					else html_text+="N/A";
					html_text +="</form>";
					html_text += "</td>";
					
					html_text += "<td>";
					if(row[i]['classifications']!=null&&row[i]['classifications'][0]['segment']['name']!=null)
					html_text += row[i]['classifications'][0]['segment']['name'];
					else html_text+="N/A";
					html_text += "</td>";
			    	html_text += "<td>";
			    	html_text +="<form action='' method ='post' > ";
			    	var latt= row[i]['_embedded']['venues'][0]['location']['latitude'];
			    	var lonn= row[i]['_embedded']['venues'][0]['location']['longitude'];
					html_text +="<p class='venuenames' style='font-size:15px;text-align:center;' onclick='showmap("+latt+","+lonn+","+i+")'>"+ row[i]['_embedded']['venues'][0]['name']+ "</p>";
					/*row[i]['_embedded']['venues'][0]['location']['longitude']*/
					/*row[i]['_embedded']['venues'][0]['location']['latitude']*/
					html_text+="<td>";
					html_text+="star";
					html_text += "</td>";


					html_text +="</form>";
					html_text += "</td>";

					


				html_text += "</tr>";
			}
			html_text = html_text + "</table>";
			return html_text;
			
		}







$(function(){
	$("#searchbutton").click(function(){
		var str=$("#keyword").val();
		if(check_str(str)==false){
			$("#msg").text("Please enter a keyword.");
		}
		else{
			$("#msg").text("");
		}
		str=$("#remote").val();
		if(check_str(str)==false&& $("input[name='from']:checked").val()=="there"){
			$("#msg2").text("Please enter a location.");

		}
		else{
			$("#msg2").text("");
		}
		return false;

	})

})
function check_str(str){
	for(i=0;i<str.length;i++){
		if(str[i]!=' '){
			return true;
		}
	}
	return false;
}
function cancelid(id){
			document.getElementById(id).disabled=false;
			document.getElementById(id).required=true;

}
function disableid(id){
			document.getElementById(id).disabled=true;   
}