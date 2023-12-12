// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Global element variable declaration
  headerDateEl = $("#currentDay");
  saveButtonEl = $(".saveBtn");

  // Get the current time using the DayJS API
  function getTime() {
    now = dayjs();
    return now;
  }

  // Generate time-blocks from 9AM to 5PM
  function generateTimeBlocks() {
    // Assuming a workday starts at 9 AM and ends at 5 PM
    var workdayStartHour = 9;
    var workdayEndHour = 17;

    // Assuming you have a container with the id "timeBlocksContainer" to append the generated blocks
    var timeBlocksContainer = $(".container-lg");

    for (let hour = workdayStartHour; hour <= workdayEndHour; hour++) {
      twelveHour = hour - 12; // Takes the current hour (24hrs) and subtracts 12 (12hr)
      // if hour is more than 12, it uses the twelveHour variable for the time
      if (hour > 12) {
        var timeBlock = $("<div>")
          .attr("id", `hour-${hour}`)
          .addClass("row time-block")
          .append(
            // Append time block, textarea, and save button to div
            $("<div>")
              .addClass("col-2 col-md-1 hour text-center py-3")
              .text(`${twelveHour}PM`),
            $("<textarea>")
              .addClass("col-8 col-md-10 description")
              .attr("rows", "3"),
            $("<button>")
              .addClass("btn saveBtn col-2 col-md-1")
              .attr("aria-label", "save")
              .append(
                $("<i>").addClass("fas fa-save").attr("aria-hidden", "true")
              )
          );

        timeBlocksContainer.append(timeBlock);
        // if hour equals 12, it uses the hour variable followed with a PM
      } else if (hour == 12) {
        var timeBlock = $("<div>")
          .attr("id", `hour-${hour}`)
          .addClass("row time-block")
          .append(
            // Append time block, textarea, and save button to div
            $("<div>")
              .addClass("col-2 col-md-1 hour text-center py-3")
              .text(`${hour}PM`),
            $("<textarea>")
              .addClass("col-8 col-md-10 description")
              .attr("rows", "3"),
            $("<button>")
              .addClass("btn saveBtn col-2 col-md-1")
              .attr("aria-label", "save")
              .append(
                $("<i>").addClass("fas fa-save").attr("aria-hidden", "true")
              )
          );

        timeBlocksContainer.append(timeBlock);
        // else the loop will use the hour variable followed with AM.
      } else {
        var timeBlock = $("<div>")
          .attr("id", `hour-${hour}`)
          .addClass("row time-block")
          .append(
            // Append time block, textarea, and save button to div
            $("<div>")
              .addClass("col-2 col-md-1 hour text-center py-3")
              .text(`${hour}AM`),
            $("<textarea>")
              .addClass("col-8 col-md-10 description")
              .attr("rows", "3"),
            $("<button>")
              .addClass("btn saveBtn col-2 col-md-1")
              .attr("aria-label", "save")
              .append(
                $("<i>").addClass("fas fa-save").attr("aria-hidden", "true")
              )
          );

        timeBlocksContainer.append(timeBlock);
      }
    }
  }

  generateTimeBlocks();

  // Save text from text-block on click.
  $(".saveBtn").on("click", function () {
    // Get the sibling of clicked button
    var textarea = $(this).siblings(".description");

    // Get id of parent timeBlock
    var timeBlock = $(this).parent().attr("id");
    localStorage.setItem(timeBlock, textarea.val());
  });

  // Change the colours of the time block based on the current time
  function updateBlockColours() {
    // Get the current hour
    var currentHour = getTime().hour();

    // Apply styling to each time-block
    $(".time-block").each(function () {
      var blockHour = parseInt($(this).attr("id").split("-")[1]);
      // console.log(currentHour, blockHour);
      if (blockHour < currentHour) {
        $(this).removeClass("present future").addClass("past");
      } else if (blockHour === currentHour) {
        $(this).removeClass("past future").addClass("present");
      } else {
        $(this).removeClass("past present").addClass("future");
      }
    });
  }

  // Retrieves text from localstorage and adds text to appropriate textbox.
  function retrieveLocalStorageItems() {
    $(".time-block").each(function () {
      var timeBlockId = $(this).attr("id");
      var savedText = localStorage.getItem(timeBlockId);

      // Only adds text if there is a value saved in localStorage
      if (savedText !== null) {
        $(this).find(".description").val(savedText);
      }
    });
  }

  // Updates the current time in the header
  function headerTimeUpdate() {
    var rightNow = getTime();
    headerDateEl.text(rightNow.format("dddd, MMMM DD"));
  }

  headerTimeUpdate();
  updateBlockColours();
  retrieveLocalStorageItems();
  setInterval(headerTimeUpdate, 1000);
  setInterval(updateBlockColours, 1000);
});
