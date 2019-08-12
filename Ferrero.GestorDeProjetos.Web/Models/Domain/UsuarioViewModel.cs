using System.ComponentModel.DataAnnotations;

namespace Ferrero.GestorDeProjetos.Web.Models.Domain
{
    public class UsuarioViewModel
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Por favor, digite o login do usuário.")]
        [StringLength(25
            , MinimumLength = 5
            , ErrorMessage  = "A {0} deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Login")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Por favor, digite o nome do usuário.")]
        [StringLength(50
            , MinimumLength = 1
            , ErrorMessage  = "A {0} deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Nome")]
        public string Nome { get; set; } 

        [Required(ErrorMessage = "Por favor, digite o e-mail do usuário.")]
        [EmailAddress(ErrorMessage  = "O {0} do usuário deve ser um e-mail válido.")]
        [Display(Name = "E-mail")]
        public string Email { get; set; }
        
        
        [Required(ErrorMessage = "Por favor, digite a senha do usuário.")]
        [StringLength(10
            , MinimumLength = 6
            , ErrorMessage  = "A {0} do usuário deve possuir no máximo {1} e no mínimo {2} caracteres.")]
        [Display(Name = "Senha")]
        public string Senha { get; set; }

        [Display(Name = "Administrator")]
        public bool IsAdmin { get; set; }

        
        public static explicit operator UsuarioViewModel(Usuario usuario)
        {
            return new UsuarioViewModel
            {
                Id = usuario.Id,
                Login = usuario.Login,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Senha = usuario.Senha,
                IsAdmin = usuario.IsAdmin
            };
        }
        public static explicit operator Usuario(UsuarioViewModel usuario)
        {
            return new Usuario
            {
                Id = usuario.Id,
                Login = usuario.Login,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Senha = usuario.Senha,
                IsAdmin = usuario.IsAdmin
            };
        }
    }
}