using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.Security
{
    public class LoginViewModel
    {
        
        [Required(ErrorMessage = "Por favor, digite o usuário.")]
        [Display(Name = "Usuário")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Por favor, digite a senha do usuário.")]
        [Display(Name = "Senha")]
        [DataType(DataType.Password)] 
        public string Password { get; set; }
    }
}