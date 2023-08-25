module.exports.home = function(req,res){
  if (req.isAuthenticated()) {
        
      
    // Set user_id cookie
 
   return res.render('habit', {
       title: "habit"
   });
}
return res.render('home',{
  title:"home",
})// Render signin page if not authenticated
}
