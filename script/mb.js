/**
 * Design:
 *   The model classes are: Repository , Section and Chapter
 *    
 *   1. The functions in the script renders the model classes on HTML element
 *   using JQuery library. The HTML elements are declared in mb.html
 *   and are referred in this script by their ids.
 *   2. Each chapter specifies its content as URL to a HTML file in the server. 
 *      That file is loaded dynamically on to a HTML element.
 *      @see show_chapter()
 *   3. The navigation buttons are populated with the next and previous chapter in
 *      the repository. Hence the chapters are ordered as they are added to the repository
 *   4. The table of content is dynamically generated from the repository.
 *   5. The chapter is parsed for tokens to be used in Glossary. The glossary terms
 *      are rendered using a template
 */

/**
  * Repository is the cotainer of all sections and chapters.
  * The chapters are ordered.
  * 
 */
class Repository {
    constructor() {
        console.debug(`creating empty content Repository...`)
        this.chapters       = []
        this.sections       = []  
    }

    /**
     * Find the chapter with given 0-based index.
     * If given idx is out of bounds, get the first i.e. chapter  at index 0
     * @param {int} idx 0-based serial index of the chapters
     * @returns a chapter or the 0-th chapter
     */
    find_chapter_by_id(idx) {
        if (idx < 0) return this.chapters[0]
        if (idx >= this.chapters.length) return this.chapters[0]
        return this.chapters[idx]
    }

    debug() {
        for (var i = 0; i < this.sections.length; i++) {
            console.debug(`${this.sections[i].title}`)
        }
        for (var i = 0; i < this.chapters.length; i++) {
            var chapter = this.chapters[i]
            console.debug(`${chapter.idx} ${chapter.label} ${chapter.title}`)
        }
    }
}

// **********************************************************************
class Chapter {
    /**
     * creates a chapter. The index is not assigned at construction.
     * It is added when chapter is added to the repository
     * @param {object} data has label, title and src
     */
    constructor(data) {
        this.idx   = -1
        this.label = data['label']
        this.title = data['title']
        this.src   = data['src']
        this.url   = ''
    }
}
// **********************************************************************
class Section {
    /**
     * creates a section. The index is not assigned at construction.
     * It is added when section is added 
     * @param {object} data has label, title, root and src
     */
    constructor(data) {
        this.idx   = -1
        this.label = data['label']
        this.title = data['title']
        this.root  = data['root']
        this.src   = data['src']
        this.chapters = []
    }
}
// ************************************************************************
class Mahabharath {
    constructor() {
        console.debug(`creating Mahabharatha...`)
        this.options = {
            logo: 'mb-logo.jpeg',
            root : {content: 'chapter', 
                   glossary: 'glossary',
                   images:   'images' }
        }
        this.repo = new Repository()
    }
    /**
     * The last shown chapter index is stored in local storage with 'chapter-idx' as key.
     * If not stored defaults to 0.
     * @returns last shown chapter
     */
    read_current_chapter_from_local_storage = function() {
        var idx = window.localStorage.getItem('chapter-idx') || 0
        console.debug(`read last shown chapter index ${idx} from local storage`)
        return this.repo.find_chapter_by_id(idx)
    }

    
    /**
     * Creates and adds a new section. 
     * All sections are maintained by the repo.
     * A section id is assigned and section url 
     * The input section root is relative to the content root directory.
     * The section root is appended to the root content directory to create an URL 
     * The chapters will be added to the section later.
     * @param {Section} section 
     * 
     * @return the new section added
     */
    new_section(data) {
        var section = new Section(data)
        section.idx = this.repo.sections.length
        section.label = roman_numeral(section.idx+1, true)
        section.root = this.options.root.content + '/' + section.root
        section.url  = `${section.root}/${section.src}`
        console.debug(`new_section ${section.label}  [${section.title}] ${section.root}`)
        this.repo.sections.push(section)
        return section
    }
    /**
     * adds the chapter. All chapters are maintained by the repo.
     * every chapter refers to its section
     * the chapter url is section root prepended to chapter source
     * The chapters are added to the repo in order.
     * @param {Chapter} chapter 
     */
    add_chapter(section, chapter) {
        chapter.section = section
        chapter.url = `${section.root}/${chapter.src}`

        section.chapters.push(chapter)
        chapter.idx = this.repo.chapters.length
        chapter.label = `${section.label}.${roman_numeral(section.chapters.length)}`
        chapter.url = `${section.root}/${chapter.src}`
        console.debug(`add_chapter ${chapter.idx} [${chapter.label} ${chapter.title}] ${chapter.url}`)
        this.repo.chapters.push(chapter)
    }
    /**
     * adds the chapter. The chapter url is the section.root prepended with chapter source
     * @param {Chapter} chapter 
     */
    show_chapter = function (chapter) {
        if (!chapter) {
            console.warn(`can not show undefined chapter`)
            return
        } 
        console.debug(`show chapter ${chapter.toString()}`)
        console.debug(`saving chapter index ${chapter.idx} in local storage`)
        // save chapter being rendered in the local storage. This acts like a bookmark
        localStorage.setItem('chapter-idx', chapter.idx)
        $('#section-title').text(chapter.section.title)
        $('#chapter-title').text(chapter.title)
        $('#chapter-title').css('font-weight', 'bold')
        $('#status').text(chapter.title)
        // the action handlers are set after the content is loaded into the view
        var ctx = this
        $('#chapter-main').load(chapter.url, function() {
            // glossary element when cicked pops-up the href content 
            $(".glossary").on("click", function() {
                ctx.show_glossary($(this))
            })
        })
        $('#chapter-next-button').data('chapter-idx', chapter.idx+1)
        $('#chapter-next-tooltip').data('chapter-idx', chapter.idx+1)
        $('#chapter-prev-button').data('chapter-idx', chapter.idx-1)
        $('#chapter-prev-tooltip').data('chapter-idx', chapter.idx-1)

        $('#chapter-next-tooltip').text(ctx.repo.find_chapter_by_id(chapter.idx+1).title)
        $('#chapter-prev-tooltip').text(ctx.repo.find_chapter_by_id(chapter.idx-1).title)
        
        // remove all past action handlers from naviagtion button
        $('.navigation-button').off('click')
        $(".navigation-button").on('click', function() {
            var chapter_idx = $(this).data('chapter-idx') // get the chapter associated with the button
            var chapter_navigated = ctx.repo.find_chapter_by_id(chapter_idx)
            ctx.show_chapter(chapter_navigated)
            return false // IMPORTANT 
        })
        
    }

    show_status = function($button, text1, text2) {
        var $status = $('#status')
        $button.hover(function() {
            $status.text(text1)
        }, function() {
            $status.text(text2)
        })
    }

    /**
     * A glossary term is shown as a non-modal popup dialog. 
     * The glossary term HTML element specifies 'href' content.
     *  
     * @param {jQuery} $el 
     */
    show_glossary($el) {
        var href  = $el.attr('href') || "missing.html"
        href = `${this.options.root.glossary}/${href}`
        
        // the glossary content href is w.r.t. the root of glossary
        console.debug(`loading glossary content from ${href}`)
        popup_dialog(href, {title:$el.attr('title') || $el.text()})
    }
    

    /**
     * Renders titles of all sections and their chapters to the given element
     * as a list.
     * Each title when clicked will display the content. 
     * 
     * Do nothing if the given div element is already populated
     * 
     * @see #populate_toc_items
     * 
     * @param {jQuery} $div 
     */
    show_toc = function($div) {
        if ($div.children().length == 0) {
            console.debug(`show_toc ${this.repo.sections.length} sections`)
            
            var $ul = $('<ul>')
            $ul.css('padding', '0')
            $ul.css('list-style-type', 'none')
            
            $div.append($ul)
            console.debug(`populate_toc_items ${this.repo.sections.length} sections`)
            for (var i = 0; i < this.repo.sections.length; i++) {
                var $li = this.populate_section($div, this.repo.sections[i])
                $ul.append($li)
            }
        }
    }
    /**
     * Create a section
     * @param {jQuery} $div
     * @param {Section} section 
     */
    populate_section = function($div, section) {
        console.debug(`populate_section ${section.title} ${section.chapters.length} chapetrs`)

        var $item = $('<li>')
        $item.css('white-space', 'nowrap')
        $item.addClass('w3-text-yellow')
        $div.append($item)
        $item.text(section.title)

        var $ul = $('<ul>')
        $ul.css('list-style-type', 'none')
        $ul.css('overflow', 'hidden')
        $ul.css('text-overflow', 'ellipsis')
        $ul.addClass('w3-text-white w3-small')

        $item.append($ul)
        for (var i =0; i < section.chapters.length; i++) {
            var chapter = section.chapters[i]
            var $li = $('<li>')
            $li.addClass('w3-tooltip')
            $ul.append($li)
            // list item shows the title of each chapter. The chapter title if long
            // is ecliipiszed. Then the tooltip shows the entire title
            $li.text(chapter.label + ' ' + chapter.title)
            var $tooltip = $('<span>')
            $tooltip.addClass('w3-text w3-tag w3-text-red')
            $tooltip.css("position:absolute;left:-20px;bottom:18px")
            $tooltip.text(chapter.title)
            $li.append($tooltip)
            $li.on('click', function() {
                // IMPORTANT
                return false
            })
            $li.on('click', this.show_chapter.bind(this, chapter))
        }
        return $item
    }
}
const ROMAN_NUMERALS = [undefined,
                        'i', 'ii', 'iii', 'iv', 'v',
                        'vi', 'vii', 'viii', 'ix', 'x',
                        'xi', 'xii', 'xiii', 'xiv', 'xv',
                        'xvi', 'xvii', 'xviii', 'xix', 'xx']
const ROMAN_NUMERALS_CAPITAL = [undefined,
                            'I', 'II', 'III', 'IV', 'V',
                            'VI', 'VII', 'VIII', 'IX', 'X',
                            'XI', 'XII', 'XIII', 'XIV', 'XV',
                            'XVI', 'XVII', 'XVIII', 'XIX', 'XX']
    
function roman_numeral(num, capitalized) {
        return capitalized ? ROMAN_NUMERALS_CAPITAL[num] : ROMAN_NUMERALS[num]
}

const DEFAULT_DIALOG_OPTIONS = {autoOpen:true, modal:false, 
    width:600, height:400,
    maxWidth:800, maxHeight:500
}
/**
 * Shows a popup dialog. 
 * 
 * @param {jQuery} $el the jQuery element. 
 * The 'href' attribute: content of the popup
 * 
 */
    // TODO: Position the popup based on how many popup are open
    // TODO: Mimimize non-modal popup
function popup_dialog(href, options) {
    // create a DIV and append it to DOM
    var $dialog = $('<div>')
    $('body').append($dialog)
    // load href on the created DIV and show the DIC as a dialog after loading is complete
    $dialog.load(href, function() {
        $(this).dialog(Object.assign(options, DEFAULT_DIALOG_OPTIONS))
    })
}

Chapter.prototype.toString = function () {
    return `${this.idx} [${this.section.title}] [${this.title}] ${this.url}`
}
Section.prototype.toString = function () {
    return `${this.idx} [${this.title}] ${this.url}`
}



