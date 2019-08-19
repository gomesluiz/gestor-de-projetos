using System.Data.Common;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Ferrero.GestorDeProjetos.Web.Models.Security;
using Microsoft.AspNetCore.Authentication;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    [Authorize]
    public class ConexaoController : Controller
    {
        private UserManager<Usuario>    _userManager;
        private SignInManager<Usuario>  _signInManager;
        
        public ConexaoController(UserManager<Usuario> userManager
            , SignInManager<Usuario> signInManager)
        {
            _userManager   = userManager;
            _signInManager = signInManager;
        }

        // GET: Conexao/SignIn
        [AllowAnonymous]
        public async Task<IActionResult> SignIn()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);
            return View();
        }

        // POST: Conexao/SignIn
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignIn(SignInViewModel loginViewModel)
        {
            if (ModelState.IsValid)
            {
                try 
                {
                    var usuario = await _userManager.FindByNameAsync(loginViewModel.UserName);

                    if (usuario != null)
                    {
                        await _signInManager.SignOutAsync();
                        Microsoft.AspNetCore.Identity.SignInResult resultado = 
                            await _signInManager.PasswordSignInAsync(usuario, loginViewModel.Password, false, false);
                        if (resultado.Succeeded)
                            return Redirect("/Projetos");

                        ModelState.AddModelError(nameof(usuario.UserName), "Falha na Conexão: Usuário e/ou Senha Inválidos!");
                    }
                    return View(loginViewModel);
                }
                catch(DbException e)
                {
                    ModelState.AddModelError(""
                        , "Não é conectar no sistema neste momento. " 
                        + "Motivo: " + e.Message + ". "
                        + "Tente novamente, e se o problema persistir " 
                        + "entre em contato com o administrador do sistema.");  
                }
            }

            return View(loginViewModel);
        }

        // GET: Conexao/SignOut
        [HttpGet] 
        [AllowAnonymous]
        public async Task<IActionResult> SignOut()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }
    }
}
