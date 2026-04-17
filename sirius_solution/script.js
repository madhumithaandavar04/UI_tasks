 const countryCodes = {
	"United States": "US",
	"India": "IN",
	"Canada": "CA",
	"United Kingdom": "GB",
};

$(document).ready(function () {
   //create tabs
    $("#tabsContainer").tabs();
//create accordion
    $("#solutionsAccordion").accordion({
        collapsible: true,
        heightStyle: "content",
        icons: {
            header: "ui-icon-triangle-1-e",
            activeHeader: "ui-icon-triangle-1-s",
        }
    });

    // select the table body and create fragment
    const $tbody = $("#locationsTableBody");
    const fragment = document.createDocumentFragment();

    //fetch and render location data
    $.getJSON("./data/locations.json")
        .done(function (data) {
            $.each( data,function (index,location) {
                // identify country flag
              const flagCode = countryCodes[location.country];
                //create row
                const $tr = $("<tr>").addClass("locations-table__row");

                // create table data
                const $tdCountry = $("<td>").addClass("locations-table__cell");
                const $flagImage= $("<img>").addClass("flag-icon").attr("src",`https://flagsapi.com/${flagCode}/flat/64.png`);
                const $flagWrapper = $("<figure>").addClass("flag-icon__wrapper");
                $flagWrapper.append($flagImage);
                $tdCountry.append($flagWrapper);

                const $tdState = $("<td>").addClass("locations-table__cell").text(location.state );
                const $tdCity = $("<td>").addClass("locations-table__cell").text(location.city );
                const $tdContact = $("<td>").addClass("locations-table__cell").text(location.contact);

                // add row to fragment
                $tr.append($tdCountry, $tdState, $tdCity, $tdContact);
                fragment.appendChild($tr.get(0));
                
            });

            // append the table
            $tbody.append(fragment);
        })
        .fail(function () {
            $tbody.append(
                "<tr><td colspan='4' style='padding: 40px; text-align: center; color: #e53e3e;'>Failed to load location data. Please ensure you are viewing this via a local server.</td></tr>"
            );
        });
});