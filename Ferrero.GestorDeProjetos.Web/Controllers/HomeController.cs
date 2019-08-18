using Microsoft.AspNetCore.Mvc;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => Redirect("/Conexao/SignIn");
/* 
        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
*/
    }
}
