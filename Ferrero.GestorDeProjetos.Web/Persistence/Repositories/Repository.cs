using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Ferrero.GestorDeProjetos.Web.Persistence.Repositories
{
    /// <summary>
    /// Concrete implementation of a generic repository.
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
        public void Update(TEntity entity)
        {
            _entities.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }
        public void Remove(int id)
        {
            TEntity entity = _entities.Find(id);
            this.Remove(entity);
        }
        public void Remove(TEntity entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached)
            {
                _entities.Attach(entity);
            }
            _entities.Remove(entity);
        }
        public TEntity Get(int id)
        {
            return _entities.Find(id);
        }
        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _entities.ToListAsync();
        }
        public IEnumerable<TEntity> Find(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = _entities;

            if (filter != null)
            {
                query = _entities.Where(filter);
            }

            foreach(var property in includeProperties.Split
                (new char[]{ ','}, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(property);
            }
            
            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }

            return query.ToList();
        }
        public async Task<IEnumerable<TEntity>> FindAsync(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "")
        {
            
            return await Task.FromResult(Find(filter, orderBy, includeProperties));
        }
    }
}