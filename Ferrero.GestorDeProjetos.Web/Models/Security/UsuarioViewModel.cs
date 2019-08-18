using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.Security
{
    public class UsuarioViewModel
    {
        public string Id { get; set; }
        
        [Required(ErrorMessage = "Digite o usuário.")]
        [StringLength(25
            , MinimumLength = 5
            , ErrorMessage  = "A Usuário deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Usuário")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Digite o nome do usuário.")]
        [StringLength(50
            , MinimumLength = 1
            , ErrorMessage  = "A {0} deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Nome")]
        public string Nome { get; set; } 

        [Required(ErrorMessage = "Digite o e-mail do usuário.")]
        [EmailAddress(ErrorMessage  = "O {0} do usuário deve ser um e-mail válido.")]
        [Display(Name = "E-mail")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Digite a senha do usuário.")]
        [StringLength(10
            , MinimumLength = 6
            , ErrorMessage  = "A Senha do usuário deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Senha")]
        public string Password { get; set; }
        
        public static explicit operator UsuarioViewModel(Usuario usuario)
        {
            return new UsuarioViewModel
            {
                Id = usuario.Id,
                UserName = usuario.UserName,
                Nome = usuario.FullName,
                Email = usuario.Email
            };
        }
        public static explicit operator Usuario(UsuarioViewModel usuario)
        {
            return new Usuario
            {
                Id = usuario.Id,
                UserName = usuario.UserName,
                FullName = usuario.Nome,
                Email = usuario.Email,
            };
        }
    }
}