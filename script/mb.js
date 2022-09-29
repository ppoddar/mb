// Two parallel array of chapetr and ids
let chapter_ids    = []
let chapters       = []
let sections       = []
/**
 * Adds th egiven chapter. The order in which the chapters are added determines
 * the order they are shown and navigated
 * @param {Chapter} chapter 
 */
function add_chapter(chapter) {
    chapter_ids.push(chapter.id)
    chapters.push(chapter)
}
function add_section(section) {
    console.debug(`add_section ${section.title}`)
    sections.push(section)
    for (var i = 0; i < section.chapters.length; i++) {
        add_chapter(section.chapters[i])
    }
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
        show_status($button, 'go to '+chapter_next.title, 'showing ' + chapter.title)
    }
    $("#chapter-prev-button").off()
    if (chapter_prev) {
        var $button = $("#chapter-prev-button")
        $button.on('click', show_chapter.bind(null, chapter_prev))
        show_status($button, 'go to '+chapter_prev.title, 'showing '+chapter.title)
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
        console.debug(`find_chapter_next chapter_id ${chapter.id}. Returing next ${next.title}...`)

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
    console.debug(`find_chapter_prev chapter_id ${chapter.id}. Returing prev ${prev.title}...`)
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

/**
 * Renders all sections and their chapters to the given element.
 * Displays the element as a dialog.
 * Each item when clicked will display the content 
 * 
 * Do nothing if the given dialog element is already populated
 * 
 * @param {jQuery} $dialog 
 */
function show_toc($dialog) {
    if ($dialog.children().length == 0) {
        console.debug(`show_toc ${sections.length} sections`)
        populate_toc_items($dialog)
    }
    $dialog.dialog({
        autoOpen:true, 
        modal:true,
        title: "Chapters"})
}

/**
 * 
 * @param {jQuery} $dialog 
 */
function populate_toc_items($dialog) {
    var $ul = $('<ul>')
    $dialog.append($ul)
    console.debug(`populate_toc_items ${sections.length} sections`)
    for (var i = 0; i < sections.length; i++) {
        var $li = populate_section($dialog, sections[i])
        $ul.append($li)
    }
}
/**
 * Create a section
 * @param {jQuery} $dialog
 * @param {Section} section 
 */
function populate_section($dialog, section) {
    console.debug(`populate_section ${section.title} ${section.chapters.length} chapetrs`)

    var $item = $('<li>')
    $dialog.append($item)
    $item.text(section.title)

    var $ul = $('<ul>')
    $item.append($ul)
    for (var i =0; i < section.chapters.length; i++) {
        var chapter = section.chapters[i]
        var $li = $('<li>')
        $ul.append($li)
        $li.text(chapter.id + ' ' + chapter.title)
        $li.on('click', function() {
            $dialog.dialog('close')
            // IMPORTANT
            return false
        })
        $li.on('click', show_chapter.bind(null, chapter))
    }
    return $item
}



class Chapter {
    constructor(data) {
        this.id    = data['id']
        this.title = data['title']
        this.url   = data['url']
    }
}

class Section {
    constructor(data) {
        this.id = data['id']
        this.title = data['title']
        this.chapters = data['chapters']
    }
}

