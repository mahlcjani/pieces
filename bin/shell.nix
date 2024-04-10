with import <nixpkgs> {};

mkShellNoCC {
    packages = [
        neo4j
    ];
}

