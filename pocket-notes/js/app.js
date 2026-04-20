$(function () {
  const KEY = 'pocket_notes';
  const PAGE_SIZE = 10;
  const COLORS = ['#E1C2E6', '#FFFFFF', '#FFCC80', '#E6EE9C', '#FFAB91'];
  let notes = loadNotes();   // Load stored notes
  let visibleCount = PAGE_SIZE;
  let editingId = null;
  let currentDetailId = null;     // null -> new notes
  let pendingAction = null;          // callback stored for leave confirm modal
  let hasUnsavedChanges = false;
  let selectedColor = COLORS[0];

  /**
   * load notes get notes array stored in localstorage and return
   * @returns {Array}
   */
  function loadNotes() {
    const stored = localStorage.getItem(KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  }

  /** persist the in-memory array to localstorage*/
  function saveNotes() {
    localStorage.setItem(KEY, JSON.stringify(notes));
  }

  /**
   * generate random id
   * @returns id
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  /**
   * format the date
   * @param {*} iso 
   * @returns 
   */
  function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  /**
   * sorted notes
   * @param {*} notes 
   * @returns sorted notes
   */
  function sortNotes(notes) {
    return [...notes].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
  }
  /**
   * Show the home page
   * @returns home page 
   */
  function renderHome() {
    const $grid = $('#notesGrid');
    const $empty = $('#emptyState');
    const $loadMore = $('#loadMoreWrap');
    const $deleteAll = $('#btnDeleteAll');
    if (notes.length != 0) {
      //Sort by most recently edited then order by created date
      const sorted = sortNotes(notes);
      if (sorted.length === 0) {
        $empty.show();
        $loadMore.hide();
        $deleteAll.hide();
        return;
      }
      $empty.hide();
      $deleteAll.show();
      const toShow = sorted.slice(0, visibleCount);
      toShow.forEach((note, index) => $grid.append(buildCard(note, index)));
      $(".note-card__image").on('error', function () {
        $(this).remove();
      })
      if (visibleCount >= sorted.length) {
        $loadMore.hide();
      } else {
        $loadMore.show();
      }
    }
    else {
      setEmptyState();
    }
  }

  /**
   * get the card id and build the card and return it
   * @param {*} note 
   * @param {*} index 
   * @returns card
   */
  function buildCard(note, index) {
    const delay = (index % PAGE_SIZE) * 50;
    const $noteImage = note?.image;
    const $imgElement = $noteImage
      ? $('<img>').addClass("note-card__image").attr({ "src": $noteImage, "alt": "note image" }).on('error', function () {
        $(this).attr("src", "https://www.dummyimg.in/placeholder?width=855&height=384&text=Note%20Image");
      })
      : $('<img>').addClass("note-card__image").attr({ "src": '', "alt": "no image" }).hide();
    const $article = $('<article>').data('target', `${note?.id}`).addClass("note-card").css({ 'animation-delay': `${delay}ms`, 'background-color': `${note?.color}` })
    const $title = $('<h3>').addClass("note-card__title").text(`${note?.title}`);
    const $date = $('<p>').addClass("note-card__date").text(`${formatDate(note?.updatedAt || note?.createdAt)}`);
    const $body = $('<p>').addClass("note-card__body").text(`${note?.content}`);
    $article.append($title, $date, $imgElement, $body).on('click', function (e) {
      e.preventDefault();
      const id = $(this).data('target');
      $('#detail-image-wrap').removeClass('has-image').hide();
      renderDetail(id);
    })
    return $article;
  }
  /**
   * create attach card
   * @param {*} notes 
   * @param {*} place 
   */
  function attachCard(notes, place) {
    const $grid = $('#notesGrid');
    const $notesFragment = $(document.createDocumentFragment());
    notes.forEach((note, index) => {
      $notesFragment.append(buildCard(note, index));
    })
    if (place === "front")
      $grid.prepend($notesFragment);
    else if (place === "rear") {
      $grid.append($notesFragment);
    }
  }
  /**
   * it gets the note id and render the detail of the notes
   * @param {*} id 
   * @returns detail page
   */
  function renderDetail(id) {
    const note = notes.find(note => note.id === id);
    if (!note) { showPage('Home'); return; }
    currentDetailId = id;
    $('#detail-title').text(note?.title);
    $('#detail-date').text(formatDate(note?.updatedAt || note.createdAt));
    $('#detail-body').text(note.content);
    $('#detail-color-dot').css('background-color', note.color || COLORS[0]);

    const $imgWrap = $('#detailImageWrap');
    const $img = $('#detailImage');
    if (note?.image) {
      $imgWrap.addClass('has-image');
      $img.attr('src', `${note?.image}`);
      $img.on('error', function () {
        $(this).attr('src', '');
        $(this).attr("src", "https://www.dummyimg.in/placeholder?width=855&height=384&text=Note%20Image");
      })
      $imgWrap.addClass('has-image');
      $img.show();
      console.log("Added image");
    } else {
      $img.hide();
      $imgWrap.removeClass('has-image');
    }
    showPage('Detail');
  }
  /**
   * it get the page name and show the page
   * @param {*} name 
   */
  function showPage(name) {
    $('.page').removeClass('active');
    $(`#page${name}`).addClass('active');
  }
  /**
   * get the last updated/created notes and return its color 
   * @returns color 
   */
  function getLastUsedColor() {
    if (notes.length === 0) return COLORS[0];
    const last = [...notes].sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    )[0];
    return last ? last.color : COLORS[0];
  }
  /**
   * it get the color from the created note for update notes and it return last used color or first color for new notes
   * @param {*} defaultColor 
   */
  function initColorPicker(defaultColor) {
    const newColor = defaultColor || getLastUsedColor() || COLORS[0];
    refreshColorList(newColor);
  }

  /**
   * refresh colors
   * @param {*} newColor 
   */
  function refreshColorList(newColor) {
    $(`.color-list[data-color="${selectedColor}"]`).removeClass('selected');
    $(`.color-list[data-color="${newColor}"]`).addClass('selected');
    selectedColor = newColor;
  }
  //event listener to update colorPiker
  $('.color-list').click(function () {
    refreshColorList($(this).data('color'));
  });
  /**
   * openNewModal get the id of the note or null for create new note and open the new/edit note modal form
   * @param {*} id 
   */
  function openNoteModal(id) {
    hasUnsavedChanges = false;
    editingId = id || null;

    // determine the state data
    const isEditing = !!editingId;
    const note = isEditing ? notes.find(n => n.id === editingId) : null;

    // configuration for the UI
    const config = {
      modalTitle: isEditing ? 'EDIT NOTE' : 'NEW NOTE',
      saveBtnText: isEditing ? 'SAVE' : 'ADD',
      saveBtnDisabled: !isEditing,
      title: note?.title || '',
      image: note?.image || '',
      content: note?.content || '',
      color: note?.color || null
    };

    // update the UI
    updateModalUI(config);

    //show the modal
    clearErrors();
    $('#modalOverlay').addClass('visible');
    $('#modalNote').addClass('open');
    setTimeout(() => $('#noteTitle').focus(), 350);
  }

  // Helper function to update modal UI
  function updateModalUI(config) {
    $('#modalNoteTitle').text(config.modalTitle);
    $('#modalNoteSave').text(config.saveBtnText).prop('disabled', config.saveBtnDisabled);
    $('#noteTitle').val(config.title);
    $('#noteImage').val(config.image);
    $('#noteContent').val(config.content);
    initColorPicker(config.color);
  }
  /**
   * close Note modal close the modal and remove the overlay 
   */
  function closeNoteModal() {
    $('#modalNote').removeClass('open');
    $('#modalOverlay').removeClass('visible');
    editingId = null;
    hasUnsavedChanges = false;
  }
  // click button to create new note event listener
  $('#btnNew').on('click', () => openNoteModal(null));
  // eventlistener for modal 
  // close button
  $('#modalNoteClose').on('click', () => {
    if (hasUnsavedChanges) {
      pendingAction = closeNoteModal;
      openLeaveConfirm();
    } else {
      closeNoteModal();
    }
  });
  // Close on overlay click
  $('#modelOverlay').on('click', () => {
    if ($('#modalNote').hasClass('open')) {
      if (hasUnsavedChanges) {
        pendingAction = closeNoteModal;
        openLeaveConfirm();
      } else {
        closeNoteModal();
      }
    }
  });
  // Track unsaved changes and enable/disable save/add button
  $('#noteTitle, #noteImage, #noteContent').on('input', () => {
    hasUnsavedChanges = true;
    if (validateForm()) {
      $('#modalNoteSave').prop('disabled', false);
    } else {
      $('#modalNoteSave').prop('disabled', true);
      validateForm()
    }
  });

  /**
   *  check the form validation
   * @returns {boolean}
   */
  function validateForm() {
    let valid = true;
    const title = $('#noteTitle').val().trim();
    const content = $('#noteContent').val().trim();

    if (!title) {
      $('#errorTitle').text('Title is required.');
      $("#errorTitle").css("display", "block");
      return false;
    }
    else if (title.length > 100) {
      $('#errorTitle').text('Title must be less than 100 letters');
      $("#errorTitle").css("display", "block");
      return false;
    } else {
      $("#errorTitle").css("display", "none");
    }

    if (!content) {
      $('#errorContent').text('Content is required.');
      $("#errorContent").css("display", "block");
      return false;
    } else {
      $("#errorContent").css("display", "none");

    }
    return true;

  }

  /**
   * clear the error title and content
   */
  function clearErrors() {
    $('#errorTitle, #errorContent').text('');
  }

  // when user click save button it create new notes or updating existing note
  $('#modalNoteSave').on('click', () => {
    const title = $('#noteTitle').val().trim();
    const content = $('#noteContent').val().trim();
    const image = $('#noteImage').val().trim() || "";
    const now = new Date().toISOString();
    const $grid = $('#notesGrid');
    const newNote = {
      id: editingId || generateId(),
      title: title,
      content: content,
      image: image,
      color: selectedColor,
      createdAt: now,
      updatedAt: now
    };
    if (editingId) {
      console.log(editingId);
      const index = notes.findIndex(n => n.id === editingId);
      if (index !== -1) {
        $(`.note-card`).filter(function () { return $(this).data('target') == editingId }).remove();
        newNote.createdAt = notes[index].createdAt;
        notes[index] = { ...notes[index], title, content, image, color: selectedColor, updatedAt: now };
        attachCard([newNote], "front");
        showToast('Note updated!');
        // save in-memory array to localstorage
        renderDetail(editingId);
        showPage('Detail')
        editingId = null;
      }
    } else {
      //new note
      notes.unshift(newNote);
      showToast('Note added!');
      attachCard([newNote], "front");
      checkLoadMore();
      showPage("Home");
      if (notes.length != 1 && notes.length > visibleCount)
        $grid.children().last().remove();
    }
    saveNotes();
    if (notes.length > 0) {
      clearEmptyState();
    }
    closeNoteModal();
  });

  // Delete from edit modal
  $('#modalNoteDelete').on('click', () => openDeleteConfirm(editingId, false));

  /**
   * it opens confirm dialogue box and set the title and message of the confirmation box
   * @param {*} id 
   * @param {*} isAll 
   */
  function openDeleteConfirm(id, isAll) {
    $('#modalConfirmDelete').addClass('open');
    if (isAll) {
      // modalShow(all)
      $('#confirm-delete-title').text('DELETE ALL NOTES');
      $('#confirm-delete-message').text('Are you sure you want to delete all notes?');
      $('#confirmDeleteYes').data('target', 'all');
    } else {
      $('#confirm-delete-title').text('DELETE NOTE');
      $('#confirm-delete-message').text('Are you sure you want to delete this note?');
      $('#confirmDeleteYes').data('target', id || currentDetailId);
    }
  }

  //eventlistener for close the confirm delete box
  $('#confirm-delete-close').on('click', () => $('#modalConfirmDelete').removeClass('open'));

  //it executes when the user confirm the deletion
  $('#confirmDeleteYes').on('click', function () {
    const target = $(this).data('target');
    if (target === 'all') {
      notes = [];          // clean the in-memory array
      showToast('All notes deleted.');
      saveNotes();
      $('#notesGrid').empty();
    } else {
      console.log("HI");
      notes = notes.filter(note => note.id !== target);
      $('.note-card').filter(function () {
        return $(this).data('target') == target;
      }).remove();
      saveNotes();
      let currentNotes = sortNotes(notes);
      const index = $("#grid").children().length;
      console.log(currentNotes[index]);
      if (visibleCount < notes.length)
        attachCard([currentNotes[index]], "rear");
      showToast('Note deleted.');
    }
    if ($('#notesGrid').children().length === 0) {
      setEmptyState();
    }
    checkLoadMore();
    // save to localstorage
    $('#modalConfirmDelete').removeClass('open');
    if ($('#pageDetail').hasClass('active')) {
      showPage('Home');
    }
  });
  /**
   * set the empty state
   */
  function setEmptyState() {
    $("#grid").empty();
    $('#emptyState').show();
    $('#loadMoreWrap').hide();
    $('#btnDeleteAll').hide();
  }
  /**
   * clear the empty state
   */
  function clearEmptyState() {
    $('#emptyState').hide();
    checkLoadMore()
    $('#btnDeleteAll').show();
  }
  //listener for delete buttons
  $('#btnDeleteAll').on('click', () => openDeleteConfirm(null, true));
  $('#btnDetailDelete').on('click', () => openDeleteConfirm(currentDetailId, false));
  // Edit on detail page
  $('#btnDetailEdit').on('click', () => {
    openNoteModal(currentDetailId);
    showPage("Detail");
  });
  /**
   * confirm the  action of closingModal
   */
  function openLeaveConfirm() {
    $('#modalConfirmLeave').addClass('open');
  }
  //close the confirm leave modal
  $('#confirmLeaveClose').on('click', () => {
    $('#modalConfirmLeave').removeClass('open');
    pendingAction = null;
  });
  // yes-> close confirm leave modal
  $('#confirmLeaveYes').on('click', () => {
    $('#modalConfirmLeave').removeClass('open');
    if (typeof pendingAction === 'function') {
      pendingAction();
      pendingAction = null;
    }
  });
  //listener for arrow back button
  $('#btnBack').on('click', () => showPage('Home'));

  // loadMore btn listener
  $('#btnLoadMore').on('click', () => {
    const $loadMore = $('#loadMoreWrap');
    const notes = loadNotes();
    const loadCount = notes.length > (PAGE_SIZE + visibleCount) ? PAGE_SIZE : notes.length - visibleCount;
    let currentNotes = sortNotes(notes);
    currentNotes = currentNotes.slice(visibleCount, visibleCount + loadCount);
    visibleCount += loadCount;
    attachCard(currentNotes, "rear");
    console.log("load", loadCount);
    console.log("visible count", visibleCount);
    console.log("total count", notes.length);
    checkLoadMore();
  });
  /**
   * it check whether there is more card available to show
   */
  function checkLoadMore() {
    const $loadMore = $('#loadMoreWrap');
    if (visibleCount >= notes.length) {
      $loadMore.hide();
    } else {
      $loadMore.show();
    }
  }

  /*toast message*/
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    $('#toast').text(msg).addClass('show');
    toastTimer = setTimeout(() => $('#toast').removeClass('show'), 2000);
  }
  $('#grid').on('change')

  //listen for escape button to close the top modal
  $(document).on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($('#modalConfirmLeave').hasClass('open')) {
      $('#confirmLeaveClose').trigger('click');
    } else if ($('#modalConfirmDelete').hasClass('open')) {
      $('#confirm-delete-close').trigger('click');
    } else if ($('#modalNote').hasClass('open')) {
      $('#modalNoteClose').trigger('click');
    }
  });
  //initial render of home
  renderHome();
});


