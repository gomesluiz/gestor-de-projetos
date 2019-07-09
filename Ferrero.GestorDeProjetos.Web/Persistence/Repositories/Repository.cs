using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    /// <summary>
    /// </summary>
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly DbContext _context;
        protected readonly DbSet<TEntity> _entities;
        public Repository(DbContext context)
        {
            _context = context;
            _entities = _context.Set<TEntity>();
        }
        public void Add(TEntity entity)
        {
           _entities.Add(entity);
        }

        public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public TEntity Get(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<TEntity> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Remove(TEntity entity)
        {
            throw new NotImplementedException();
        }
    }
}