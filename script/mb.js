// Two parallel array of chapetr and ids
let chapter_ids    = []
let chapters       = []
/**
 * Adds th egiven chapter. The order in which the chapters are added determines
 * the order they are shown and navigated
 * @param {Chapter} chapter 
 */
function add_chapter(chapter) {
    chapter_ids.push(chapter.id)
    chapters.push(chapter)
}

/**
 * Show the content of the given chapter to main content area
 * Update the navigation button state
 * 
 * @param {Chapter} chapter to be shown. A warning if chapter is undefiend
 */
function show_chapter(chapter) {
    console.debug(`show_chapter ${chapter.id}`)
    if (!chapter) {
        console.warn(`can not show undefiend chapter`)
        return
    }
    console.debug(`show chapter ${chapter.id}: [${chapter.title}] ${chapter.url}`)
    $('#chapter-title').text(chapter.title)
    var chapter_next = find_chapter_next(chapter)
    var chapter_prev = find_chapter_prev(chapter)
    $('#chapter-main').load(chapter.url)
    $("#chapter-next-button").off()
    if (chapter_next)  {
        var $button = $("#chapter-next-button")
        $button.on('click', show_chapter.bind(null, chapter_next))
        show_status($button, chapter_next.title, chapter.title)
    }
    $("#chapter-prev-button").off()
    if (chapter_prev) {
        var $button = $("#chapter-prev-button")
        $button.on('click', show_chapter.bind(null, chapter_prev))
        show_status($button, chapter_prev.title, chapter.title)
    }
}



/**
 * Gets the chapter next to the given chapter
 * @param {Chapter} chapter
 * @return next chapter or undefined
 */
function find_chapter_next(chapter) {
    var idx = chapter_ids.indexOf(chapter.id)
    if (idx >= chapters.size-1) {
        console.warn(`no next chapter for ${chapter.id} idx:${idx}`)
        return
    }
    var next = chapters[idx+1]
    if (next)
        console.log(`find_chapter_next chapter_id ${chapter.id}. Returing next ${next.title}...`)

    return next


}
/**
 * Gets the chapter previous to the given chapter
 * @param {Chapter} chapter
 * @returns previous chpater or undefiend
 */
 function find_chapter_prev(chapter) {
    var idx = chapter_ids.indexOf(chapter.id)
    if (idx == 0) {
        console.warn(`no previous chapter for ${chapter.id} idx:${idx}`)
        return
    }
    var prev = chapters[idx-1]
    console.log(`find_chapter_prev chapter_id ${chapter.id}. Returing prev ${prev.title}...`)
    return prev

}

/**
 * Shows tooltip 
 * @param {*} text 
 */
function show_status($button, text1, text2) {
    $button.hover(function() {
        $('#status').text(text1)
    }, function() {
        $('#status').text(text2)
    })
}

function show_toc($dialog) {
    if ($dialog.children().length == 0) {
        populate_toc_items($dialog)
    }
    $dialog.dialog({
        autoOpen:true, 
        modal:true,
        title: "Chapters"})
}

function populate_toc_items($dialog) {
    var $ul = $('<ul>')
    $dialog.append($ul)
    for (var i = 0; i < chapter_ids.length; i++) {
        var $li = $('<li>')
        $ul.append($li)
        var chapter = chapters[i]
        $li.text(chapter.id + ' ' + chapter.title)
        $li.on('click', function() {
            $dialog.dialog('close')
            // IMPORTANT
            return false
        })
        $li.on('click', show_chapter.bind(null, chapter))
    }
}


class Chapter {
    constructor(data) {
        this.id    = data['id']
        this.title = data['title']
        this.url   = data['url']
    }
}

