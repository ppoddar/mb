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
    constructor(options) {
        console.debug(`creating empty content Repository...`)
        this.options    = options || {}
        this.sections   = []  
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
        section.idx = this.sections.length
        section.label = roman_numeral[section.idx+1]
        section.url  = `${this.options.docroot}/${this.options.root.content}/${section.root}`
        console.debug(`new_section [${section.title}] ${section.url}`)
        section.repo = this
        this.sections.push(section)
        return section
    }
  

    /**
     * Find the chapter with given 0-based index.
     * If given idx is out of bounds, get the first i.e. chapter  at index 0
     * @param {int} idx 0-based serial index of the chapters
     * @returns a chapter or the 0-th chapter
     */
    find_chapter_by_id(idx1, idx2) {
        if (idx1 < 0 || idx1>=this.sections.length) 
            console.log(`section index ${idx1} out of bounds`)
        else
            return this.sections[idx1].chapters[idx2]
    }
    next_chapter(chapter){
        var idx2 = chapter.index+1
        if (idx2 >= this.sections[idx1].length) {
            idx2 = 0
            idx1 = 0
        }

        return this.sections[idx1].chapters[idx2]
    }
       

    
}

// **********************************************************************
class Chapter {
    
    /**
     * creates a chapter. The index is not assigned at construction.
     * It is added when chapter is added to the repository
     * @param {object} data has title and src
     */
    constructor(data) {
        this.idx   = -1
        this.title = data['title']
        this.src   = data['src']
        this.url   = ''
    }

    next(){
        var idx1 = 0
        var idx2 = 0
        var lastChapter = this.idx==this.section.chapters.length-1
        if (lastChapter){
            var lastsection = this.section.idx == this.section.repo.sections.length-1
            if (lastsection) {
                idx1 = 0
                idx2 = 0
            } else 
                idx1 = this.section.idx+1
                idx2 = 0
            } else {
                 idx1 = this.section.idx
                 idx2 = this.idx+1
            }
            return this.section.repo.find_chapter_by_id(idx1, idx2)
    }
    
    prev(){
        var idx1 = 0
        var idx2 = 0
        var repo = this.section.repo

        var firstChapter = this.idx==0
        if (firstChapter){
            var firstsection = this.section.idx == 0 //
            if (firstsection) {
                idx1 = repo.sections.length-1 // last section
            } else {
                idx1 = this.section.idx-1 // previous section
            }
            idx2 = repo.sections[idx1].chapters.length-1 // last chapter of prev section
        } else {
                 idx1 = this.section.idx // section does not change; same 
                 idx2 = this.idx-1
            }
            return this.section.repo.find_chapter_by_id(idx1, idx2)
        }
    show(){
        console.debug(`show chapter ${this}`)
        console.debug(`saving chapter index ${this.idx} in local storage`)
        localStorage.setItem('chapter-idx', this.idx)
        localStorage.setItem('section-idx', this.section.idx)
        $('#section-title').text(this.section.title)
        var $title = $('#chapter').find('#title')
        var $content = $('#chapter').find('#content')
        if ($content.length==0) alert('html element for content not found')
        $title.text(this.title)
        $title.css('font-weight', 'bold')
        $title[0].scrollIntoView({behaviour:'smooth'})
        var ctx = this
        $('.chapter-next-button').data('chapter', this.next())
        $('.chapter-prev-button').data('chapter', this.prev())
        console.log(`loading chapter ${$content} from [${this.url}]...`)
        $content.load(this.url, function() {
            console.log(`complete loading ${ctx.url}`)
            // glossary element when cicked pops-up the href content 
            $(".glossary").on("click", function() {
                ctx.show_glossary($(this))
            })
            
        })
        
        // remove all past action handlers from naviagtion button
        $('.navigation-button').off('click')
        $(".chapter-next-button").on('click', function(){
            var chapter = $(this).data('chapter');
            chapter.show()
            return false // IMPORTANT 
        })
        $(".chapter-prev-button").on('click', function(){
            var chapter = $(this).data('chapter');
            chapter.show()
            return false // IMPORTANT 
        })
        
    }   
}


// **********************************************************************
class Section {
    /**
     * creates a section. The index is not assigned at construction.
     * It is added when section is added 
     * @param {object} data has title, root 
     * title of the section displayed
     * root path directory w.r.t docroot that stores all chapter source
     */
    constructor(data) {
        this.idx   = -1
        this.title = data['title']
        this.root  = data['root']
        this.url   = ''
        this.chapters = []
    }

    /**
     * adds the chapter to this section. All chapters are maintained by the repo indirectly.
     * every chapter refers to its section.
     * the chapter url is section root prepended to chapter source
     * The chapters are added to the section in order.
     * @param {Chapter} chapter 
     */
    add_chapter(chapter) {
        chapter.section = this
        chapter.url = `${this.url}/${chapter.src}`

        chapter.idx = this.chapters.length
        chapter.label = `${roman_numeral[this.idx]}.${roman_numeral[chapter.idx]}`
        this.chapters.push(chapter)
        chapter.url = `${this.url}/${chapter.src}`
        console.debug(`add_chapter ${chapter.idx} [${chapter.title}] ${chapter.url}`)
        
    }

}
// ************************************************************************
class Mahabharath {
    constructor() {
        console.debug(`creating Mahabharatha...`)

        var options = {
            docroot:'content',
            logo: 'mb-logo.jpeg',
            // root paths w.r.t docroot 
            root : {content: 'chapters', 
                   glossary: 'glossary',
                   images:   'images' }
            }
            this.repo = new Repository(options)
           this.populate_content()
        }
    

    populate_content() {

        //     The content repository is populated statically
            // The content URLs are hardcoded
            // Add sections and chapters that refer to the content files on the server w.r.t sectiopn root
            var adiParva  = this.repo.new_section(new Section({title:"Adi Parva", root:"adi"}))
            var vanaParva = this.repo.new_section(new Section({title:"Vana Parva", root:"vana"}))
            adiParva.add_chapter(new Chapter({title:"The Kuru Clan",           src:"00_kuru_clan.html"}))
            adiParva.add_chapter(new Chapter({title:"Banished from Heaven",    src:"01_banished_from_heaven.html"}))
            adiParva.add_chapter(new Chapter({title:"Ganga Makes a Pact",      src:"02_ganga_makes_a_pact.html"}))
            adiParva.add_chapter(new Chapter({title:"Babies Floated in River", src:"03_babies_floated_in_river.html"}))
            adiParva.add_chapter(new Chapter({title:"The Lost Son Returns",    src:"05_lost_son_returns.html"}))
            adiParva.add_chapter(new Chapter({title:"A Marriage Proposal",     src:"06_marriage_proposal.html"}))
            adiParva.add_chapter(new Chapter({title:"Vishma Elopes the Brides",src:"08_vishma_elopes_brides.html"}))
            adiParva.add_chapter(new Chapter({title:"Surrogate Birth",         src:"09_surrogate_birth.html"}))
            adiParva.add_chapter(new Chapter({title:"Vyaas Comes to Rescue",   src:"10_vyaas_comes_to_rescue.html"}))
            adiParva.add_chapter(new Chapter({title:"Birth of Kauravus",       src:"11_birth_of_kurus.html"}))
            adiParva.add_chapter(new Chapter({title:"The Death of Pandu",      src:"13_death_of_pandu.html"}))
            adiParva.add_chapter(new Chapter({title:"Murder Attempt on Bhim",  src:"14_bhim_murder_attempt.html"}))
            adiParva.add_chapter(new Chapter({title:"Drona Trains the Princes",src:"15_drona_trains_princes.html"}))
            adiParva.add_chapter(new Chapter({title:"The House of Lac",        src:"16_house_of_lac.html"}))
            adiParva.add_chapter(new Chapter({title:"Hirimb and Ghatotcacha",  src:"17_hirimb_and_ghatotcacha.html"}))
            adiParva.add_chapter(new Chapter({title:"killing of BakRakshak",   src:"18_killing_of_bakarakshakh.html"}))
            adiParva.add_chapter(new Chapter({title:"The birth of Draupadi",   src:"19_birth_of_draupadi.html" }))
            
            vanaParva.add_chapter(new Chapter({title:"Moy Builds Palace",       src:"01_moy_builds_palace.html"}))
            
            
         
        
    }
    /**
     * The last shown chapter index is stored in local storage with 'chapter-idx' as key.
     * If not stored defaults to 0.
     * @returns last shown chapter
     */
    read_current_chapter_from_local_storage = function() {
        var idx1 = window.localStorage.getItem('section-idx') || 0
        var idx2 = window.localStorage.getItem('chapter-idx') || 0
        if (idx1 == null || idx1 == 'undefined') idx1 = 0
        if (idx2 == null || idx2 == 'undefined') idx2 = 0
        console.debug(`read last shown chapter index ${idx2} from local storage`)
        return this.repo.find_chapter_by_id(idx1, idx2)
    }

    
          /**
     * adds the chapter. The chapter url is the section.root prepended with chapter source
     * @param {Chapter} chapter 
     */
    show_chapter = function (evt) {
        
        var chapter = $(evt.target).data('chapter')
        if (!chapter) {
            alert(`can not show undefined chapter`)
            throw new Error(`can not show undefined chapter`)
            
        } 
        console.debug(`show chapter ${chapter.toString()}`)
        console.debug(`saving chapter index ${chapter.idx} in local storage`)
        // save chapter being rendered in the local storage. This acts like a bookmark
        localStorage.setItem('chapter-idx', chapter.idx)
        $('#section-title').text(chapter.section.title)
        var $title = this.$el('#chapter #title')
        var $content = $('#chapter').find('#content')
        if ($content.length==0) alert('html element for content not found')
        $title.text(`${chapter.label} ${chapter.title}`)
        $title.css('font-weight', 'bold')
        $title[0].scrollIntoView()
        // the action handlers are set after the content is loaded into the view
        var ctx = this
        $('#chapter-next-button').data('chapter', chapter.next())
        $('#chapter-prev-button').data('chapter', chapter.prev())
        console.log(`loading chapter ${$content} from [${chapter.url}]...`)
        $content.load(chapter.url, function() {
            //alert(`loaded ${chapter.url}`)
            // glossary element when cicked pops-up the href content 
            $(".glossary").on("click", function() {
                ctx.show_glossary($(this))
            })
            
        })
        
        // remove all past action handlers from naviagtion button
        $('.navigation-button').off('click')
        $(".navigation-button").on('click', function(){
            ctx.show_chapter(evt)
            return false // IMPORTANT 
        })
        
    }
 $el = function (sel) {
    var e = $(sel)
    if (e.length==0) {
    alert(`html element [${sel}] not found`) 
    throw Error(`html element ${sel} not found`)}   
    return e
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
        $item.addClass('parva')
        $div.append($item)
        $item.text(section.title)

        var $ul = $('<ul>')
        $ul.addClass('parva-list')

        $item.append($ul)
        for (var i =0; i < section.chapters.length; i++) {
            var chapter = section.chapters[i]
            var $li = $('<li>')
           
            $ul.append($li)
            $li.text(`${chapter.label}) ${chapter.title}`)
            $li.on('click', function() {
                // IMPORTANT
                return false
            })
            $li.data('chapter', chapter) // IMPORTANT
            $li.on('click', chapter.show.bind(chapter))
        }
        return $item
    }
}
const roman_numeral = [
                        'i', 'ii', 'iii', 'iv', 'v',
                        'vi', 'vii', 'viii', 'ix', 'x',
                        'xi', 'xii', 'xiii', 'xiv', 'xv',
                        'xvi', 'xvii', 'xviii', 'xix', 'xx']
const ROMAN_NUMERALS_CAPITAL = [
                            'I', 'II', 'III', 'IV', 'V',
                            'VI', 'VII', 'VIII', 'IX', 'X',
                            'XI', 'XII', 'XIII', 'XIV', 'XV',
                            'XVI', 'XVII', 'XVIII', 'XIX', 'XX']
    


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
    return `${this.section.idx}:${this.idx} [${this.section.title}]/[${this.title}] ${this.url}`
}
Section.prototype.toString = function () {
    return `section ${this.idx} [${this.title}] ${this.url}`
}



