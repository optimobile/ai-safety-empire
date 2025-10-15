"""
Setup script for AI Safety Empire Python SDK
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="aisafety",
    version="1.0.0",
    author="AI Safety Empire",
    author_email="support@aisafety.ai",
    description="Official Python SDK for AI Safety Empire - Deepfake detection, AI governance, and blockchain verification",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/ai-safety-empire/python-sdk",
    project_urls={
        "Bug Tracker": "https://github.com/ai-safety-empire/python-sdk/issues",
        "Documentation": "https://docs.aisafety.ai",
        "Source Code": "https://github.com/ai-safety-empire/python-sdk",
    },
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Security",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.31.0",
        "web3>=6.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
    },
    keywords="ai safety deepfake detection blockchain governance jabulon council",
)

