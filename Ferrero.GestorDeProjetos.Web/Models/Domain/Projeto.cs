using System;

namespace Ferrero.GestorDeProjetos.Web.Models.Domain
{
    /// <summary>
    /// Esta classe contém os atributos e métodos de um projeto.
    /// </summary>
    public class Projeto {

        public const string PROJETO_SESSION_ID = "PROJETO_CORRENTE_SID";
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public DateTime DataDeInicio { get; set; }  
        public DateTime DataDeTermino { get; set; }
        public OrdemDeInvestimento OrdemDeInvestimento { get; set; }
        public bool Concluido { get; set; }
    }
}