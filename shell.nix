with import <nixpkgs> {};

mkShellNoCC {
    packages = [
        act
        k6
        nodejs
    ];
    shellHook = ''
        echo Updating packages...
        npm install
    '';
}

