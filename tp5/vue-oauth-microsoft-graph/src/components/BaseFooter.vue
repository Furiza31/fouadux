<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p class="copyright">© 2025 Vue OAuth</p>
        <div class="links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 1.5rem 0;
  margin-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.copyright {
  color: #666;
  margin: 0;
}

.links {
  display: flex;
  gap: 1.5rem;
}

.links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.links a:hover {
  color: #333;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .links {
    justify-content: center;
  }
}
</style>
