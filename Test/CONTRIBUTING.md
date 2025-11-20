# Contributing Guidelines

Thank you for your interest in contributing to the web scraping tool! This document provides guidelines for contributing to the project.

## Getting Started

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork:**
```bash
git clone https://github.com/yourusername/web-scraping-tool.git
cd web-scraping-tool
```

3. **Create a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
playwright install
```

5. **Install pre-commit hooks:**
```bash
pre-commit install
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Feature development
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes

### Making Changes

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** following the coding standards

3. **Run tests:**
```bash
pytest tests/
```

4. **Run linting:**
```bash
flake8 .
black --check .
```

5. **Commit your changes:**
```bash
git add .
git commit -m "feat: add new scraper functionality"
```

6. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request** on GitHub

## Coding Standards

### Python Code Style

- Follow PEP 8 guidelines
- Use type hints where appropriate
- Write docstrings for all public functions
- Keep functions small and focused
- Use meaningful variable and function names

### Code Formatting

We use Black for code formatting:

```bash
black .
```

### Linting

We use flake8 for linting:

```bash
flake8 .
```

### Type Checking

We use mypy for type checking:

```bash
mypy .
```

## Testing

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Aim for high test coverage

### Test Structure

```python
class TestMyFeature:
    def test_success_case(self):
        """Test that feature works correctly."""
        # Arrange
        input_data = "test"
        
        # Act
        result = my_function(input_data)
        
        # Assert
        assert result == "expected"
    
    def test_error_case(self):
        """Test that feature handles errors correctly."""
        with pytest.raises(ValueError):
            my_function(None)
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_scraper.py

# Run with coverage
pytest --cov=core --cov-report=html
```

## Documentation

### Code Documentation

- Write docstrings for all public functions
- Include type hints
- Add inline comments for complex logic
- Update README.md for new features

### API Documentation

- Document all CLI commands
- Provide usage examples
- Update configuration documentation
- Add troubleshooting guides

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No merge conflicts
- [ ] Commit messages are clear

### PR Description

Include the following in your PR description:

- **What** - What changes were made
- **Why** - Why these changes were necessary
- **How** - How the changes work
- **Testing** - How the changes were tested

### Example PR Description

```markdown
## Description
Add support for custom user agents in browser manager.

## Changes
- Added user agent configuration option
- Updated browser manager to use custom user agents
- Added validation for user agent strings

## Testing
- Added unit tests for user agent functionality
- Tested with various user agent strings
- Verified browser behavior with custom agents

## Breaking Changes
None - this is a backward-compatible addition.
```

## Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Maintenance tasks

### Examples

```
feat(browser): add stealth mode configuration
fix(proxy): handle authentication errors gracefully
docs(api): update CLI command documentation
test(scraper): add tests for error handling
```

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Description** - Clear description of the issue
- **Steps to Reproduce** - How to reproduce the bug
- **Expected Behavior** - What should happen
- **Actual Behavior** - What actually happens
- **Environment** - OS, Python version, dependencies
- **Logs** - Relevant log output

### Feature Requests

When requesting features, include:

- **Description** - Clear description of the feature
- **Use Case** - Why this feature is needed
- **Proposed Solution** - How you think it should work
- **Alternatives** - Other solutions considered

## Release Process

### Version Numbering

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version number is updated
- [ ] CHANGELOG.md is updated
- [ ] Release notes are prepared

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the golden rule

### Getting Help

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community chat (if available)
- Read the documentation thoroughly

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to the web scraping tool!







