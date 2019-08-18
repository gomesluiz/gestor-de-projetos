using System;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Ferrero.GestorDeProjetos.Web.Models.Security;

namespace Ferrero.GestorDeProjetos.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsuariosController : Controller
    {
        private readonly UserManager<Usuario> _manager;
        private IPasswordHasher<Usuario> _hasher;
        public UsuariosController(UserManager<Usuario> manager, IPasswordHasher<Usuario> hasher)
        { 
            _manager    = manager;
            _hasher     = hasher;
        }

        // GET: 
        public IActionResult Index() => View(_manager.Users.Select(u => (UsuarioViewModel)u));

        // GET: Usuario/Create
        public IActionResult Create() => View();

        // POST: Usuario/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(UsuarioViewModel usuarioViewModel)
        {
            if (ModelState.IsValid)
            {
                var usuario = _manager.FindByNameAsync(usuarioViewModel.UserName);
                if (usuario == null){
                    IdentityResult resultado = await _manager.CreateAsync((Usuario) usuarioViewModel, usuarioViewModel.Password);
                    if (resultado.Succeeded)
                        return RedirectToAction(nameof(Index));
                    else 
                    {
                        foreach (IdentityError erro in resultado.Errors)
                        ModelState.AddModelError("", erro.Description);
                    }
                } else {
                    ModelState.AddModelError("UserName", "Este usuário já existe!");
                    return View(usuarioViewModel);
                }
            
                return RedirectToAction(nameof(Index));
            }

            return View(usuarioViewModel);
        }
 
        // GET: Usuario/Edit/{id}
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null) return NotFound();

            try
            {
                var usuario = await _manager.FindByIdAsync(id);
                if (usuario == null) return NotFound();

                return View((UsuarioViewModel) usuario);
            }
            catch(Exception e)
            {
                ModelState.AddModelError(""
                    , "Não é possível editar este documento. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Documento/Edit/{id}
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, UsuarioViewModel usuarioViewModel)
        {
            if (id != usuarioViewModel.Id) return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    var usuario = await _manager.FindByIdAsync(id); 
                    usuario.UserName = usuarioViewModel.UserName;
                    usuario.FullName = usuarioViewModel.Nome;
                    usuario.Email    = usuarioViewModel.Email;
                    usuario.PasswordHash = _hasher.HashPassword(usuario, usuarioViewModel.Password);
                    
                    await _manager.UpdateAsync(usuario);
                    
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception e)
                {
                    ModelState.AddModelError(""
                    , "Não é possível editar este usuário. " 
                    + "Motivo: " + e.Message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
                }
            }

            return View(usuarioViewModel);
        }

        // GET: Usuario/Delete/5
        public async Task<IActionResult> Delete(string id, String message="")
        {
            if (id == null) return NotFound();

            if ( message != "" )
            {
                ModelState.AddModelError(""
                    , "Não é possível remover este usuário. " 
                    + "Motivo: " + message + " "
                    + "Tente novamente, e se o problema persistir " 
                    + "entre em contato com o administrador do sistema.");
            }

            try
            {  
                var usuario = await _manager.FindByIdAsync(id);
                if (usuario == null) return NotFound();

                return View((UsuarioViewModel) usuario);
            }
            catch(DbException e)
            {
                ModelState.AddModelError(""
                    , "Não é possível excluir este usuário. " 
                    + "Motivo: " + e.Message + ". "
                    + "Tente novamente, e se o problema persistir "  
                    + "entre em contato com o administrador do sistema.");
            }

            return View();
        }

        // POST: Usuario/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            Usuario usuario;
            try
            {
                usuario = await _manager.FindByIdAsync(id);
                await _manager.DeleteAsync(usuario);
            }
            catch(Exception e)
            {
                return RedirectToAction(nameof(Delete), new { id = id, message = e.Message });  
            }
            return RedirectToAction(nameof(Index));
        }
    }
    
}
