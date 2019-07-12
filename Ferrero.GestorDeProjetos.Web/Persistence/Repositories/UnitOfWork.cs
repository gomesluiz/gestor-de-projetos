using System;
using System.Threading.Tasks;
using Ferrero.GestorDeProjetos.Web.Models;
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
        private Repository<OrdemDeInvestimento> _investimentos;
        private Repository<Projeto> _portifolio;
        private Repository<RequisicaoDeCompra> _requisicoes;
        
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