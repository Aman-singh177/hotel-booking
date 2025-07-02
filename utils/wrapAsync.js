// utilities related chize means extra chize like error class wrapasync
// A utility is just a tool (function/module) that helps you avoid writing repetitive logic.
// jo try catch block hota usse aur ache se likhne ka way hota hai wrapAsync
module.exports = (fn) => {
    return (req,res ,next) =>  {
        fn(req,res,next).catch(next);
    }
}

// function wrapAsync(fn) {
//     return function(req,res ,next) {
//         fn(req,res,next).catch(next);
//     }
// }