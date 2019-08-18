using System;
using System.Threading.Tasks;
using Ferrero.GestorDeProjetos.Web.Models;
using Ferrero.GestorDeProjetos.Web.Models.Domain;
using Ferrero.GestorDeProjetos.Web.Models.Kanban;
using Ferrero.GestorDeProjetos.Web.Models.Security;
using Ferrero.GestorDeProjetos.Web.Persistence.Context;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    /// <summary>
    /// Unit of work for application repositories.
    /// </summary>
    public class UnitOfWork : IDisposable
    {
        private ApplicationDbContext _context;
        private Repository<Ativo> _ativos;
        private Repository<Documento> _documentos;
        private Repository<Fornecedor> _fornecedores;
        private Repository<NotaFiscal> _notas;
        private Repository<OrdemDeInvestimento> _investimentos;
        private Repository<Projeto> _portifolio;
        private Repository<RequisicaoDeCompra> _requisicoes;
        private Repository<ResumoFinanceiro> _resumos;
        private Repository<Tarefa> _tarefas;
        private Repository<Usuario> _usuarios;
        
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public Repository<Ativo> Ativos
        {
            get
            {

                if (this._ativos == null)
                {
                    this._ativos = new Repository<Ativo>(_context);
                }
                return _ativos;
            }
        }

        public Repository<Documento> Documentos
        {
            get
            {

                if (this._documentos == null)
                {
                    this._documentos = new Repository<Documento>(_context);
                }
                return _documentos;
            }
        }

        public Repository<Fornecedor> Fornecedores
        {
            get
            {

                if (this._fornecedores == null)
                {
                    this._fornecedores = new Repository<Fornecedor>(_context);
                }
                return _fornecedores;
            }
        }

        public Repository<NotaFiscal> NotasFiscais
        {
            get
            {

                if (this._notas == null)
                {
                    this._notas = new Repository<NotaFiscal>(_context);
                }
                return _notas;
            }
        }

        public Repository<OrdemDeInvestimento> Investimentos
        {
            get
            {

                if (this._investimentos == null)
                {
                    this._investimentos = new Repository<OrdemDeInvestimento>(_context);
                }
                return _investimentos;
            }
        }

        public Repository<Projeto> Portifolio
        {
            get
            {

                if (this._portifolio == null)
                {
                    this._portifolio = new Repository<Projeto>(_context);
                }
                return _portifolio;
            }
        }
        public Repository<RequisicaoDeCompra> Requisicoes
        {
            get
            {

                if (this._requisicoes == null)
                {
                    this._requisicoes = new Repository<RequisicaoDeCompra>(_context);
                }
                return _requisicoes;
            }
        }
        public Repository<ResumoFinanceiro> Resumos
        {
            get
            {
                if (this._resumos == null)
                {
                    this._resumos = new Repository<ResumoFinanceiro>(_context);
                }
                return _resumos;
            }
        }
        public Repository<Tarefa> Tarefas
        {
            get
            {
                if (this._tarefas == null)
                {
                    this._tarefas = new Repository<Tarefa>(_context);
                }
                return _tarefas;
            }
        }
        public Repository<Usuario> Usuarios
        {
            get
            {
                if (this._usuarios == null)
                {
                    this._usuarios = new Repository<Usuario>(_context);
                }
                return _usuarios;
            }
        }
        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}