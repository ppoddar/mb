const fs = require('node:fs');
const jsdom = require('jsdom');

/*parses all input html files for span.glossary element. for each parsed glossary term
 writes a html file in out directory.
 Accepts two command line arguments
      -in    the input directory of html files
      -out   output directory of glossary files
 */
function main() {
try {
    const dom = new jsdom. JSDOM(`<!DOCTYPE html>
               <body>
               </body>`)
    const {options, args} = readCommandlineArguments()
    var indir = options['-in'] || "."
    var outdir = options['-out'] || "."
    var filenames = fs.readdirSync(indir)
    console.log(`read ${filenames.length} files from ${indir}`)
    for (var i=0; i < filenames.length; i++) {
      var filename = `${indir}/${filenames[i]}`   
      var items = readAllGlossaryItems(filename, dom)
      console.log(`${items.length} glossary items found in [${filename}`)
      console.log(items)
      for (var j = 0; j < items.length; j++) {
                writeGlossaryFile(outdir, items[j])
    
      }
       
    }
  } catch (err) {
    console.error(err);
  }} 


  function writeGlossaryFile(outdir, item) {
    outfile = `${outdir}/${item}.html`
    if (!fs.existsSync(outfile)){
        console.log(`does not exist ${outfile}. Writing...`)
       fs.writeFileSync(outfile, `<!DOCTYPE HTML> 
      <BODY>
           No information available on ${item}.
      </BODY>`)
    } else {
         //console.log(`exists ${outfile}. Ignoring...`)
    }
    }
    
    

  

function readAllGlossaryItems(filename, dom) {
  const data = fs.readFileSync(filename, 'utf8');
  
  const jquery = require('jquery')(dom.window)
  jquery("body").append(data)
  var $items = jquery("span.glossary")
  var items  = []
  for (var i = 0; i < $items.length; i++) {
    var item = jquery($items.get(i)).text()
    items.push(item)
  }
  return items
}
function readCommandlineArguments(){
  var i = 2;
  var options = {}
  for (; i< process.argv.length-1; i++) {
      var option = process.argv[i]
      if (option.startsWith("-") )
        options[option] = process.argv[i+1]
    }
      return {options:options, args:process.argv.slice(i,)}
  }

  main()

