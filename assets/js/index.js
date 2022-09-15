
$("#add-user").submit(function (event) {
  alert("Data Inserted Successfull!");
});

$("#update_user").submit(function (event) {
  event.preventDefault();

  var unindexed_array = $(this).serializeArray();
  var data = {};

  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  console.log(data);

  var request = {
    url: `https://swagaa.herokuapp.com/update-user/${data.id}`,
    method: "POST",
    data: data,
  };

  $.ajax(request).done(function (response) {
    alert("Data Updated Successfully!");
    console.log("Data Updated Successfully!");
  });
});

if (window.location.pathname == "/all_user") {
  $ondelete = $(".table tbody td a.delete");
  $ondelete.click(function () {
    var id = $(this).attr("data-id");

    var request = {
      url: `https://swagaa.herokuapp.com/delete/${id}`,
      method: "DELETE",
    };

    if (confirm("Do you really want to delete the record?")) {
      $.ajax(request).done(function (response) {
        alert("Data Delete Successfully!");
        location.reload();
      });
    }
  });
}

// function autoClick(){
//   $("#download").click();
// }
// $(document).ready(function() {
//    var element = $("#htmlContent");

//    $("#download").on('click', function() {
//       html2canvas(element, {
//         onrendered: function(canvas) {
//              var imageData = canvas.toDataURL("image/jpg");
//              var newData = imageData.replace(/^data:image\/jpg/, "data:application/octet-stream");
//              $("#download").attr("download", "image.jpg").attr("href", newData);
//         }
//       })
//    })
// })

// document.getElementById("download").onclick = function() {
//   const screenshotTarget = document.getElementById('htmltoimage');

//   html2canvas(screenshotTarget).then((canvas) => {
//       const base64image = canvas.toDataURL("image/png");
//       var anchor = document.createElement('a');
//       anchor.setAttribute("href", base64image);
//       anchor.setAttribute("download", "BAT_Support" );
//       anchor.click();
//       anchor.remove();
//   })
// }

// function downloadimage() {
//           //var container = document.getElementById("image-wrap"); //specific element on page
//         const container = document.getElementById("htmltoimage");; // full page

//         html2canvas(container, { allowTaint: true }).then((canvas) =>{

//               var link = document.createElement("a");
//               document.body.appendChild(link);
//               link.download = "html_image.jpg";
//               link.href = canvas.toDataURL();
//               link.target = '_blank';
//               link.click();
//           });
//       }

// let closeIt = document.getElementById("closed");
// let openIt =  document.getElementById("open");

// closeIt.addEventListener("click", function(){
//   let head = document.getElementById("headers");
//   let footer = document.getElementById("foot");

//     head.style.left = "-100%"
//     openIt.style.display ="block"
//     footer.style.left = "0"
// })

// openIt.addEventListener("click", function(){
//   let head = document.getElementById("headers");
//   let footer = document.getElementById("foot");
//     head.style.left = "0"
//     openIt.style.display ="none"
//     footer.style.left = "300px"
// })
