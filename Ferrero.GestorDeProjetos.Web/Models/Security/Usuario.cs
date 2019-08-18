using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Ferrero.GestorDeProjetos.Web.Models.Security
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um usuário.
    /// </summary>
    public class Usuario : IdentityUser
    {   
        public string FullName { get; set; }
    }
}